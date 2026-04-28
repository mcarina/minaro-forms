using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;

namespace MinaroForms.Application.Forms.GetForm;

public sealed class GetFormUseCase(IFormRepository forms)
{
    public async Task<FormResponse?> ExecuteAsync(Guid formId, CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);
        return form is null ? null : FormMapping.ToResponse(form);
    }
}
