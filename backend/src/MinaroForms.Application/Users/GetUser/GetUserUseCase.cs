using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Users;

namespace MinaroForms.Application.Users.GetUser;

public sealed class GetUserUseCase(IUserRepository users)
{
    public async Task<UserResponse?> ExecuteAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        return user is null ? null : UserMapping.ToResponse(user);
    }
}
