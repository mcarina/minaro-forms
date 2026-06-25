namespace MinaroForms.Domain.Forms;

public sealed class Question
{
    private readonly List<QuestionOption> _options = [];

    private Question()
    {
    }

    internal Question(
        Guid formId,
        QuestionType type,
        string title,
        string? description,
        bool isRequired,
        int position,
        string? settingsJson)
    {
        Id = Guid.NewGuid();
        FormId = formId;
        Type = type;
        Title = RequireText(title, nameof(title));
        Description = description;
        IsRequired = isRequired;
        Position = position;
        SettingsJson = settingsJson;
    }

    public Guid Id { get; private set; }
    public Guid FormId { get; private set; }
    public QuestionType Type { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public bool IsRequired { get; private set; }
    public int Position { get; private set; }
    public string? SettingsJson { get; private set; }
    public IReadOnlyCollection<QuestionOption> Options => _options;

    public QuestionOption AddOption(string label, string value)
    {
        if (Type is not QuestionType.SingleChoice and not QuestionType.MultipleChoice)
        {
            throw new InvalidOperationException("Only choice questions can have options.");
        }

        var option = new QuestionOption(Id, label, value, _options.Count + 1);
        _options.Add(option);
        return option;
    }

    private static string RequireText(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", paramName);
        }

        return value.Trim();
    }

    public void Patch(
        string? title,
        string? description,
        bool? isRequired,
        string? settingsJson)
    {
        if (!string.IsNullOrWhiteSpace(title))
        {
            Title = RequireText(title, nameof(title));
        }

        if (description is not null)
        {
            Description = description;
        }

        if (isRequired.HasValue)
        {
            IsRequired = isRequired.Value;
        }

        if (settingsJson is not null)
        {
            SettingsJson = settingsJson;
        }
    }

}
