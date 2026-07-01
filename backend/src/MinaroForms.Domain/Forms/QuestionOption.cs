namespace MinaroForms.Domain.Forms;

public sealed class QuestionOption
{
    private QuestionOption()
    {
    }

    internal QuestionOption(Guid questionId, string label, string value, int position)
    {
        Id = Guid.NewGuid();
        QuestionId = questionId;
        Label = RequireText(label, nameof(label));
        Value = RequireText(value, nameof(value));
        Position = position;
    }

    public Guid Id { get; private set; }
    public Guid QuestionId { get; private set; }
    public string Label { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;
    public int Position { get; private set; }

    private static string RequireText(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", paramName);
        }

        return value.Trim();
    }

    public void Patch(string? label, string? value)
    {
        if (!string.IsNullOrWhiteSpace(label))
        {
            Label = RequireText(label, nameof(label));
        }

        if (!string.IsNullOrWhiteSpace(value))
        {
            Value = RequireText(value, nameof(value));
        }
    }

    internal void Update(string label, string value, int position)
    {
        Label = RequireText(label, nameof(label));
        Value = RequireText(value, nameof(value));
        Position = position;
    }

}
