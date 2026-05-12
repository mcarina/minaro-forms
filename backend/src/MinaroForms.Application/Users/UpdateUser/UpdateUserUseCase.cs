using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Users;

namespace MinaroForms.Application.Users.UpdateUser;

public sealed class UpdateUserUseCase(
    IUserRepository users,
    IPasswordHasher passwordHasher,
    IUnitOfWork unitOfWork)
{
    public async Task<UserResponse?> ExecuteAsync(
        Guid userId,
        UpdateUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var user = await users.GetByIdAsync(userId, cancellationToken);
        if (user is null)
        {
            return null;
        }

        if (await users.ExistsByEmailAsync(request.Email, userId, cancellationToken))
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        user.Rename(request.Name);
        user.ChangeEmail(request.Email);
        user.ChangeRole(request.Role);

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.ChangePasswordHash(passwordHasher.Hash(request.Password));
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return UserMapping.ToResponse(user);
    }
}
