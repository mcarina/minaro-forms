using MinaroForms.Application.Abstractions;

namespace MinaroForms.Application.Submissions.GetResponsesSummary;

public sealed class GetResponsesSummaryUseCase(IFormRepository forms)
{
    public async Task<GetResponsesSummaryResponse?> ExecuteAsync(
        Guid formId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var form = await forms.GetByIdAsync(formId, cancellationToken);

        if (form is null || form.OwnerUserId != userId)
        {
            return null;
        }

        return new GetResponsesSummaryResponse(
            form.Id,
            form.Submissions.Count,
            form.Submissions
                .OrderByDescending(submission => submission.SubmittedAt)
                .Select(submission => submission.SubmittedAt)
                .FirstOrDefault());
    }
}