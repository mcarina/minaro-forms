using System.Text.Json;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms.CreateForm;

public sealed record CreateFormRequest(
    Guid OwnerUserId,
    string Title,
    string? Description,
    IReadOnlyCollection<CreateQuestionRequest> Questions);

public sealed record CreateQuestionRequest(
    QuestionType Type,
    string Title,
    string? Description,
    bool IsRequired,
    JsonElement? Settings,
    IReadOnlyCollection<CreateQuestionOptionRequest>? Options);

public sealed record CreateQuestionOptionRequest(string Label, string Value);
