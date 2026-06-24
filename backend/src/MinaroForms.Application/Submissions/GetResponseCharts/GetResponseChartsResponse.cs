using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Submissions.GetResponseCharts;

public sealed record GetResponseChartsResponse(
    Guid FormId,
    IReadOnlyCollection<ResponseChartItem> Charts);

public sealed record ResponseChartItem(
    Guid QuestionId,
    string Title,
    QuestionType Type,
    string ChartTypeSuggestion,
    int TotalAnswers,
    IReadOnlyCollection<ResponseChartDataPoint> Data);

public sealed record ResponseChartDataPoint(
    string Label,
    int Value,
    decimal Percentage);