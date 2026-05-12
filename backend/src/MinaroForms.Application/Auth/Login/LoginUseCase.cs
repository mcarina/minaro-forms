using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Users;

namespace MinaroForms.Application.Auth.Login;

public sealed class LoginUseCase(IUserRepository users, IPasswordHasher passwordHasher)
{
    public async Task<LoginResponse?> ExecuteAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByEmailAsync(request.Email, cancellationToken);
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return new LoginResponse(UserMapping.ToResponse(user));
    }
}
