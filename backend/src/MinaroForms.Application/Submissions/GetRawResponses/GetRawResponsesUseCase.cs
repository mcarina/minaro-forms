using System.Text.Json;
using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Submissions.GetRawResponses;

public sealed class GetRawResponsesUseCase(IFormRepository forms)
{
    public async Task<GetRawResponsesResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);

        if (form is null || form.OwnerUserId != userId)
        {
            return null;
        }

        var questions = form.Questions
            .OrderBy(question => question.Position)
            .ToArray();

        var columns = questions
            .Select(question => new RawResponseColumn(
                question.Id,
                question.Title,
                question.Type,
                question.Position))
            .ToArray();

        var rows = form.Submissions
            .OrderByDescending(submission => submission.SubmittedAt)
            .Select(submission => new RawResponseRow(
                submission.Id,
                submission.SubmittedAt,
                submission.RespondentEmail,
                questions
                    .Select(question =>
                    {
                        var answer = submission.Answers
                            .FirstOrDefault(item => item.QuestionId == question.Id);

                        return MapAnswer(question, answer);
                    })
                    .ToArray()))
            .ToArray();

        return new GetRawResponsesResponse(form.Id, columns, rows);
    }

    private static RawResponseAnswer MapAnswer(
        Question question,
        SubmissionAnswer? answer)
    {
        if (answer is null)
        {
            return new RawResponseAnswer(question.Id, null, "-");
        }

        if (!string.IsNullOrWhiteSpace(answer.AnswerText))
        {
            return new RawResponseAnswer(
                question.Id,
                answer.AnswerText,
                answer.AnswerText);
        }

        if (!string.IsNullOrWhiteSpace(answer.AnswerJson))
        {
            var displayValue = FormatJsonAnswer(question, answer.AnswerJson);

            return new RawResponseAnswer(
                question.Id,
                answer.AnswerJson,
                displayValue);
        }

        return new RawResponseAnswer(question.Id, null, "-");
    }

    private static string FormatJsonAnswer(Question question, string answerJson)
    {
        try
        {
            using var document = JsonDocument.Parse(answerJson);

            if (document.RootElement.TryGetProperty("selectedValues", out var selectedValues) &&
                selectedValues.ValueKind == JsonValueKind.Array)
            {
                var values = selectedValues
                    .EnumerateArray()
                    .Where(item => item.ValueKind == JsonValueKind.String)
                    .Select(item => item.GetString())
                    .Where(value => !string.IsNullOrWhiteSpace(value))
                    .Select(value => FindOptionLabel(question, value!))
                    .ToArray();

                return values.Length == 0
                    ? "-"
                    : string.Join(", ", values);
            }

            return answerJson;
        }
        catch (JsonException)
        {
            return answerJson;
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
}