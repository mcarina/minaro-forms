using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Submissions.GetRawResponses;

public sealed record GetRawResponsesResponse(
    Guid FormId,
    IReadOnlyCollection<RawResponseColumn> Columns,
    IReadOnlyCollection<RawResponseRow> Rows);

public sealed record RawResponseColumn(
    Guid QuestionId,
    string Title,
    QuestionType Type,
    int Position);

public sealed record RawResponseRow(
    Guid SubmissionId,
    DateTimeOffset SubmittedAt,
    string? RespondentEmail,
    IReadOnlyCollection<RawResponseAnswer> Answers);

public sealed record RawResponseAnswer(
    Guid QuestionId,
    string? Value,
    string DisplayValue);
