using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;

namespace MinaroForms.Application.Forms.PublishForm;

public sealed class PublishFormUseCase(IFormRepository forms, IUnitOfWork unitOfWork)
{
    public async Task<PublishFormResponse?> ExecuteAsync(
        Guid formId,
        PublishFormRequest request,
        string frontendBaseUrl,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);
        if (form is null)
        {
            return null;
        }

        if (request.IsPublished)
        {
            var shareUrl = $"{frontendBaseUrl.TrimEnd('/')}/Formulario/respostas/{form.Id}";
            form.Publish(shareUrl);
        }
        else
        {
            form.Unpublish();
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        var message = request.IsPublished
            ? "Publicado com sucesso!"
            : "Link privado com sucesso!";

        return new PublishFormResponse(
            message,
            form.ShareUrl);
    }
}