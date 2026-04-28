using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Submissions.CreateSubmission;

public sealed class CreateSubmissionUseCase(IFormRepository forms, IUnitOfWork unitOfWork)
{
    public async Task<CreateSubmissionResponse?> ExecuteAsync(
        Guid formId,
        CreateSubmissionRequest request,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);
        if (form is null)
        {
            return null;
        }

        var answers = request.Answers.Select(answer => new SubmissionAnswer(
            answer.QuestionId,
            answer.AnswerText,
            answer.Answer?.GetRawText()));

        var submission = form.Submit(request.RespondentEmail, request.RespondentUserId, answers);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateSubmissionResponse(submission.Id, submission.FormId, submission.SubmittedAt);
    }
}
