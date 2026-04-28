using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;

namespace MinaroForms.Application.Forms.PublishForm;

public sealed class PublishFormUseCase(IFormRepository forms, IUnitOfWork unitOfWork)
{
    public async Task<FormResponse?> ExecuteAsync(Guid formId, CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);
        if (form is null)
        {
            return null;
        }

        form.Publish();
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(form);
    }
}
