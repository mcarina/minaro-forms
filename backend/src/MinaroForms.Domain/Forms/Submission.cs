namespace MinaroForms.Domain.Forms;

public sealed class Submission
{
    private readonly List<SubmissionAnswer> _answers = [];

    private Submission()
    {
    }

    internal Submission(
        Guid formId,
        string? respondentEmail,
        Guid? respondentUserId,
        IEnumerable<SubmissionAnswer> answers)
    {
        Id = Guid.NewGuid();
        FormId = formId;
        SubmittedAt = DateTimeOffset.UtcNow;
        RespondentEmail = respondentEmail;
        RespondentUserId = respondentUserId;
        _answers.AddRange(answers);
    }

    public Guid Id { get; private set; }
    public Guid FormId { get; private set; }
    public DateTimeOffset SubmittedAt { get; private set; }
    public string? RespondentEmail { get; private set; }
    public Guid? RespondentUserId { get; private set; }
    public IReadOnlyCollection<SubmissionAnswer> Answers => _answers;
}
