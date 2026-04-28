using System.Text.Json;

namespace MinaroForms.Application.Submissions.CreateSubmission;

public sealed record CreateSubmissionRequest(
    string? RespondentEmail,
    Guid? RespondentUserId,
    IReadOnlyCollection<CreateSubmissionAnswerRequest> Answers);

public sealed record CreateSubmissionAnswerRequest(
    Guid QuestionId,
    string? AnswerText,
    JsonElement? Answer);

public sealed record CreateSubmissionResponse(Guid Id, Guid FormId, DateTimeOffset SubmittedAt);
