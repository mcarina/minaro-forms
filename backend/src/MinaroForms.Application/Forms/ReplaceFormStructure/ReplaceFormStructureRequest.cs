using System.Text.Json;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms.ReplaceFormStructure;

public sealed record ReplaceFormStructureRequest(
    string Title,
    string? Description,
    IReadOnlyCollection<ReplaceQuestionRequest> Questions);

public sealed record ReplaceQuestionRequest(
    Guid? Id,
    QuestionType Type,
    string Title,
    string? Description,
    bool IsRequired,
    JsonElement? Settings,
    IReadOnlyCollection<ReplaceQuestionOptionRequest>? Options);

public sealed record ReplaceQuestionOptionRequest(
    Guid? Id,
    string Label,
    string Value);
