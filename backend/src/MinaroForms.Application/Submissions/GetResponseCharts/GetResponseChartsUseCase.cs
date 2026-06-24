using System.Text.Json;
using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Submissions.GetResponseCharts;

public sealed class GetResponseChartsUseCase(IFormRepository forms)
{
    public async Task<GetResponseChartsResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);

        if (form is null || form.OwnerUserId != userId)
        {
            return null;
        }

        var charts = form.Questions
            .OrderBy(question => question.Position)
            .Where(IsChartable)
            .Select(question => BuildChart(question, form.Submissions))
            .ToArray();

        return new GetResponseChartsResponse(form.Id, charts);
    }

    private static bool IsChartable(Question question)
    {
        return question.Type is
            QuestionType.SingleChoice or
            QuestionType.MultipleChoice or
            QuestionType.Date;
    }

    private static ResponseChartItem BuildChart(
        Question question,
        IReadOnlyCollection<Submission> submissions)
    {
        if (question.Type == QuestionType.Date)
        {
            return BuildDateChart(question, submissions);
        }

        return BuildChoiceChart(question, submissions);
    }

    private static ResponseChartItem BuildChoiceChart(
        Question question,
        IReadOnlyCollection<Submission> submissions)
    {
        var counts = question.Options
            .OrderBy(option => option.Position)
            .ToDictionary(option => option.Label, _ => 0);

        foreach (var submission in submissions)
        {
            var answer = submission.Answers
                .FirstOrDefault(item => item.QuestionId == question.Id);

            foreach (var value in ReadAnswerValues(answer))
            {
                var label = FindOptionLabel(question, value);

                if (!counts.ContainsKey(label))
                {
                    counts[label] = 0;
                }

                counts[label]++;
            }
        }

        var totalAnswers = counts.Values.Sum();

        var data = counts
            .Select(item => new ResponseChartDataPoint(
                item.Key,
                item.Value,
                CalculatePercentage(item.Value, totalAnswers)))
            .ToArray();

        return new ResponseChartItem(
            question.Id,
            question.Title,
            question.Type,
            SuggestChartType(question),
            totalAnswers,
            data);
    }

    private static ResponseChartItem BuildDateChart(
        Question question,
        IReadOnlyCollection<Submission> submissions)
    {
        var counts = new SortedDictionary<string, int>();

        foreach (var submission in submissions)
        {
            var answer = submission.Answers
                .FirstOrDefault(item => item.QuestionId == question.Id);

            if (answer?.AnswerText is null)
            {
                continue;
            }

            if (!DateTimeOffset.TryParse(answer.AnswerText, out var date))
            {
                continue;
            }

            var label = date.ToString("dd/MM/yyyy");

            if (!counts.ContainsKey(label))
            {
                counts[label] = 0;
            }

            counts[label]++;
        }

        var totalAnswers = counts.Values.Sum();

        var data = counts
            .Select(item => new ResponseChartDataPoint(
                item.Key,
                item.Value,
                CalculatePercentage(item.Value, totalAnswers)))
            .ToArray();

        return new ResponseChartItem(
            question.Id,
            question.Title,
            question.Type,
            "line",
            totalAnswers,
            data);
    }

    private static string SuggestChartType(Question question)
    {
        if (question.Type == QuestionType.SingleChoice)
        {
            return question.Options.Count <= 4 ? "donut" : "bar";
        }

        if (question.Type == QuestionType.MultipleChoice)
        {
            return "bar";
        }

        if (question.Type == QuestionType.Date)
        {
            return "line";
        }

        return "bar";
    }

    private static IEnumerable<string> ReadAnswerValues(SubmissionAnswer? answer)
    {
        if (answer is null)
        {
            yield break;
        }

        if (!string.IsNullOrWhiteSpace(answer.AnswerText))
        {
            yield return answer.AnswerText;
            yield break;
        }

        if (string.IsNullOrWhiteSpace(answer.AnswerJson))
        {
            yield break;
        }

        using var document = JsonDocument.Parse(answer.AnswerJson);

        if (document.RootElement.TryGetProperty("selectedValues", out var selectedValues) &&
            selectedValues.ValueKind == JsonValueKind.Array)
        {
            foreach (var item in selectedValues.EnumerateArray())
            {
                if (item.ValueKind == JsonValueKind.String)
                {
                    var value = item.GetString();

                    if (!string.IsNullOrWhiteSpace(value))
                    {
                        yield return value;
                    }
                }
            }
        }
    }

    private static string FindOptionLabel(Question question, string value)
    {
        var option = question.Options
            .FirstOrDefault(item =>
                item.Value == value ||
                item.Label == value ||
                item.Id.ToString() == value);

        return option?.Label ?? value;
    }

    private static decimal CalculatePercentage(int value, int total)
    {
        if (total == 0)
        {
            return 0;
        }

        return Math.Round((decimal)value / total * 100, 2);
    }
}