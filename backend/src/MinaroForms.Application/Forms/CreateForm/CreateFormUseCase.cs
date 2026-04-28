using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms.CreateForm;

public sealed class CreateFormUseCase(IFormRepository forms, IUnitOfWork unitOfWork)
{
    public async Task<FormResponse> ExecuteAsync(CreateFormRequest request, CancellationToken cancellationToken = default)
    {
        var form = new Form(request.OwnerUserId, request.Title, request.Description);

        foreach (var questionRequest in request.Questions)
        {
            var question = form.AddQuestion(
                questionRequest.Type,
                questionRequest.Title,
                questionRequest.Description,
                questionRequest.IsRequired,
                questionRequest.Settings?.GetRawText());

            foreach (var optionRequest in questionRequest.Options ?? [])
            {
                question.AddOption(optionRequest.Label, optionRequest.Value);
            }
        }

        await forms.AddAsync(form, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(form);
    }
}
