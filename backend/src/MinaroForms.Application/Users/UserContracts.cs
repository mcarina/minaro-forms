using MinaroForms.Domain.Users;

namespace MinaroForms.Application.Users;

public sealed record UserResponse(
    Guid Id,
    string Name,
    string Email,
    string Role,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public static class UserMapping
{
    public static UserResponse ToResponse(User user)
    {
        return new UserResponse(
            user.Id,
            user.Name,
            user.Email,
            user.Role,
            user.CreatedAt,
            user.UpdatedAt);
    }
}
