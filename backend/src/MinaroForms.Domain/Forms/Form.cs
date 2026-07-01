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

    public void ReplaceStructure(
        string title,
        string? description,
        IEnumerable<QuestionDraft> questions)
    {
        if (_submissions.Count > 0)
        {
            throw new InvalidOperationException("Cannot change form structure after receiving submissions.");
        }

        Title = RequireText(title, nameof(title));
        Description = description;

        var questionDrafts = questions.ToArray();

        var incomingIds = questionDrafts
            .Where(question => question.Id.HasValue)
            .Select(question => question.Id!.Value)
            .ToHashSet();

        foreach (var question in _questions.Where(question => !incomingIds.Contains(question.Id)).ToArray())
        {
            _questions.Remove(question);
        }

        var position = 1;

        foreach (var questionDraft in questionDrafts)
        {
            var question = questionDraft.Id.HasValue
                ? _questions.FirstOrDefault(existingQuestion => existingQuestion.Id == questionDraft.Id.Value)
                : null;

            if (question is null)
            {
                question = AddQuestion(
                    questionDraft.Type,
                    questionDraft.Title,
                    questionDraft.Description,
                    questionDraft.IsRequired,
                    questionDraft.SettingsJson);
            }

            question.UpdateStructure(
                questionDraft.Type,
                questionDraft.Title,
                questionDraft.Description,
                questionDraft.IsRequired,
                position,
                questionDraft.SettingsJson);

            question.ReplaceOptions(questionDraft.Options);
            position++;
        }

        Touch();
    }

    public sealed record QuestionDraft(
        Guid? Id,
        QuestionType Type,
        string Title,
        string? Description,
        bool IsRequired,
        string? SettingsJson,
        IReadOnlyCollection<QuestionOptionDraft> Options);

    public sealed record QuestionOptionDraft(
        Guid? Id,
        string Label,
        string Value);

    public Form Duplicate(Guid ownerUserId, string title)
    {
        var copy = new Form(
            ownerUserId,
            RequireText(title, nameof(title)),
            Description);

        foreach (var originalQuestion in _questions.OrderBy(question => question.Position))
        {
            var copiedQuestion = copy.AddQuestion(
                originalQuestion.Type,
                originalQuestion.Title,
                originalQuestion.Description,
                originalQuestion.IsRequired,
                originalQuestion.SettingsJson);

            foreach (var originalOption in originalQuestion.Options.OrderBy(option => option.Position))
            {
                copiedQuestion.AddOption(originalOption.Label, originalOption.Value);
            }
        }

        return copy;
    }

}
