namespace MinaroForms.Application.Users.CreateUser;

public sealed record CreateUserRequest(
    string Name,
    string Email,
    string Password,
    string Role = "user");
