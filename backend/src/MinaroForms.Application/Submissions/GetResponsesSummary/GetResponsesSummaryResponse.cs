namespace MinaroForms.Application.Submissions.GetResponsesSummary;

public sealed record GetResponsesSummaryResponse(
    Guid FormId,
    int TotalResponses,
    DateTimeOffset? LastResponseDate
);