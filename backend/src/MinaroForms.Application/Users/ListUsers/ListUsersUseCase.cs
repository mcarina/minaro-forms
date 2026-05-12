using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Users;

namespace MinaroForms.Application.Users.ListUsers;

public sealed class ListUsersUseCase(IUserRepository users)
{
    public async Task<IReadOnlyCollection<UserResponse>> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var result = await users.ListAsync(cancellationToken);
        return result.Select(UserMapping.ToResponse).ToArray();
    }
}
