using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms;

public sealed record FormResponse(
    Guid Id,
    Guid OwnerUserId,
    string Title,
    string? Description,
    bool IsPublished,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyCollection<QuestionResponse> Questions);

public sealed record QuestionResponse(
    Guid Id,
    QuestionType Type,
    string Title,
    string? Description,
    bool IsRequired,
    int Position,
    string? SettingsJson,
    IReadOnlyCollection<QuestionOptionResponse> Options);

public sealed record QuestionOptionResponse(Guid Id, string Label, string Value, int Position);

public static class FormMapping
{
    public static FormResponse ToResponse(Form form)
    {
        return new FormResponse(
            form.Id,
            form.OwnerUserId,
            form.Title,
            form.Description,
            form.IsPublished,
            form.CreatedAt,
            form.UpdatedAt,
            form.Questions
                .OrderBy(question => question.Position)
                .Select(question => new QuestionResponse(
                    question.Id,
                    question.Type,
                    question.Title,
                    question.Description,
                    question.IsRequired,
                    question.Position,
                    question.SettingsJson,
                    question.Options
                        .OrderBy(option => option.Position)
                        .Select(option => new QuestionOptionResponse(option.Id, option.Label, option.Value, option.Position))
                        .ToArray()))
                .ToArray());
    }
}
