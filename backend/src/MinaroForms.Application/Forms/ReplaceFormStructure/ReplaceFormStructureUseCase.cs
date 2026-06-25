using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Forms;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Forms.ReplaceFormStructure;

public sealed class ReplaceFormStructureUseCase(
    IFormRepository forms,
    IUnitOfWork unitOfWork)
{
    public async Task<FormResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        ReplaceFormStructureRequest request,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);

        if (form is null || form.OwnerUserId != userId)
        {
            return null;
        }

        var questions = request.Questions
            .Select(question => new Form.QuestionDraft(
                question.Type,
                question.Title,
                question.Description,
                question.IsRequired,
                question.Settings?.GetRawText(),
                (question.Options ?? [])
                    .Select(option => new Form.QuestionOptionDraft(
                        option.Label,
                        option.Value))
                    .ToArray()))
            .ToArray();

        form.ReplaceStructure(
            request.Title,
            request.Description,
            questions);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return FormMapping.ToResponse(form);
    }
}