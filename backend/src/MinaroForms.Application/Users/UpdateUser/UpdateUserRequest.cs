namespace MinaroForms.Application.Users.UpdateUser;

public sealed record UpdateUserRequest(
    string Name,
    string Email,
    string? Password,
    string Role);
