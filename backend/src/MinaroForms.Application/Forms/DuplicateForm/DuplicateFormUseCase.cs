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
            : request.Title;

        var copy = original.Duplicate(userId, title);

        await forms.AddAsync(copy, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(copy);
    }
}
