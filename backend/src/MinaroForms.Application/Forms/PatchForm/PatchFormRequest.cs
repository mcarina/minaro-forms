using System.Text.Json;

namespace MinaroForms.Application.Forms.PatchForm;

public sealed record PatchFormRequest(
    string? Title,
    string? Description,
    IReadOnlyCollection<PatchQuestionRequest>? Questions);

public sealed record PatchQuestionRequest(
    Guid Id,
    string? Title,
    string? Description,
    bool? IsRequired,
    JsonElement? Settings,
    IReadOnlyCollection<PatchQuestionOptionRequest>? Options);

public sealed record PatchQuestionOptionRequest(
    Guid Id,
    string? Label,
    string? Value);