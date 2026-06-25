namespace MinaroForms.Application.Forms.GetFormsByUser;

public sealed class GetFormsByUserResponse
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public string? Description { get; init; }
    
    public bool IsPublished { get; init; }

    public string? ShareUrl { get; init; }

    public int AnswersCount { get; init; }

    public string LastUpdate { get; init; } = string.Empty;

    public bool IsFavorite { get; init; }

    public bool HasResponses { get; set; }
    
    public bool CanEditStructure { get; set; }
}