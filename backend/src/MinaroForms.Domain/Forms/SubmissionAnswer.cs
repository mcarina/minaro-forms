namespace MinaroForms.Domain.Forms;

public sealed class SubmissionAnswer
{
    private SubmissionAnswer()
    {
    }

    public SubmissionAnswer(Guid questionId, string? answerText, string? answerJson)
    {
        Id = Guid.NewGuid();
        QuestionId = questionId;
        AnswerText = answerText;
        AnswerJson = answerJson;
    }

    public Guid Id { get; private set; }
    public Guid SubmissionId { get; private set; }
    public Guid QuestionId { get; private set; }
    public string? AnswerText { get; private set; }
    public string? AnswerJson { get; private set; }
}
