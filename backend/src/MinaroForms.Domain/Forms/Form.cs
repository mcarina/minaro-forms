namespace MinaroForms.Domain.Forms;

public sealed class Form
{
    private readonly List<Question> _questions = [];
    private readonly List<Submission> _submissions = [];

    private Form()
    {
    }

    public Form(Guid ownerUserId, string title, string? description)
    {
        Id = Guid.NewGuid();
        OwnerUserId = ownerUserId;
        Title = RequireText(title, nameof(title));
        Description = description;
        ShareUrl = null;
        IsPublished = false;
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; private set; }
    public Guid OwnerUserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? ShareUrl { get; private set; }
    public bool IsPublished { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }
    public IReadOnlyCollection<Question> Questions => _questions;
    public IReadOnlyCollection<Submission> Submissions => _submissions;

    public void Rename(string title, string? description)
    {
        Title = RequireText(title, nameof(title));
        Description = description;
        Touch();
    }

    public Question AddQuestion(
        QuestionType type,
        string title,
        string? description,
        bool isRequired,
        string? settingsJson = null)
    {
        var question = new Question(Id, type, title, description, isRequired, _questions.Count + 1, settingsJson);
        _questions.Add(question);
        Touch();
        return question;
    }

    public void Publish(string shareUrl)
    {
        if (_questions.Count == 0)
        {
            throw new InvalidOperationException("A form needs at least one question before publishing.");
        }

        IsPublished = true;
        ShareUrl = string.IsNullOrWhiteSpace(ShareUrl)
            ? RequireText(shareUrl, nameof(shareUrl))
            : ShareUrl;

        Touch();
    }

    public void Unpublish()
    {
        IsPublished = false;
        Touch();
    }

    public Submission Submit(string? respondentEmail, Guid? respondentUserId, IEnumerable<SubmissionAnswer> answers)
    {
        if (!IsPublished)
        {
            throw new InvalidOperationException("Only published forms can receive submissions.");
        }

        var submission = new Submission(Id, respondentEmail, respondentUserId, answers);
        _submissions.Add(submission);
        return submission;
    }

    private void Touch() => UpdatedAt = DateTimeOffset.UtcNow;

    private static string RequireText(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", paramName);
        }

        return value.Trim();
    }

    public void Patch(string? title, string? description)
    {
        if (!string.IsNullOrWhiteSpace(title))
        {
            Title = RequireText(title, nameof(title));
        }

        if (description is not null)
        {
            Description = description;
        }

        Touch();
    }

}
