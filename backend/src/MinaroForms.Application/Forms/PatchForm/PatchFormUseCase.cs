using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;

namespace MinaroForms.Application.Forms.PatchForm;

public sealed class PatchFormUseCase(
    IFormRepository forms,
    IUnitOfWork unitOfWork)
{
    public async Task<FormResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        PatchFormRequest request,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);

        if (form is null || form.OwnerUserId != userId)
        {
            return null;
        }

        form.Patch(request.Title, request.Description);

        foreach (var questionRequest in request.Questions ?? [])
        {
            var question = form.Questions
                .FirstOrDefault(item => item.Id == questionRequest.Id);

            if (question is null)
            {
                continue;
            }

            question.Patch(
                questionRequest.Title,
                questionRequest.Description,
                questionRequest.IsRequired,
                questionRequest.Settings?.GetRawText());

            foreach (var optionRequest in questionRequest.Options ?? [])
            {
                var option = question.Options
                    .FirstOrDefault(item => item.Id == optionRequest.Id);

                option?.Patch(optionRequest.Label, optionRequest.Value);
            }
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(form);
    }
}