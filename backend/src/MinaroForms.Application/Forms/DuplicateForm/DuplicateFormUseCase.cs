using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms.DuplicateForm;

public sealed class DuplicateFormUseCase(
    IFormRepository forms,
    IUnitOfWork unitOfWork)
{
    public async Task<FormResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        DuplicateFormRequest request,
        CancellationToken cancellationToken = default)
    {
        var original = await forms.GetByIdAsync(formId, cancellationToken);

        if (original is null || original.OwnerUserId != userId)
        {
            return null;
        }

        var title = string.IsNullOrWhiteSpace(request.Title)
            ? $"Cópia de {original.Title}"
            : request.Title.Trim();

        var copy = new Form(
            original.OwnerUserId,
            title,
            original.Description);

        foreach (var originalQuestion in original.Questions.OrderBy(question => question.Position))
        {
            var copiedQuestion = copy.AddQuestion(
                originalQuestion.Type,
                originalQuestion.Title,
                originalQuestion.Description,
                originalQuestion.IsRequired,
                originalQuestion.SettingsJson);

            foreach (var originalOption in originalQuestion.Options.OrderBy(option => option.Position))
            {
                copiedQuestion.AddOption(
                    originalOption.Label,
                    originalOption.Value);
            }
        }

        await forms.AddAsync(copy, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(copy);
    }
}