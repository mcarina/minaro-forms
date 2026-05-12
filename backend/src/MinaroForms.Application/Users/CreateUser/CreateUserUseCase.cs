using MinaroForms.Application.Abstractions;
using MinaroForms.Application.Users;
using MinaroForms.Domain.Users;

namespace MinaroForms.Application.Users.CreateUser;

public sealed class CreateUserUseCase(
    IUserRepository users,
    IPasswordHasher passwordHasher,
    IUnitOfWork unitOfWork)
{
    public async Task<UserResponse> ExecuteAsync(CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        if (await users.ExistsByEmailAsync(request.Email, cancellationToken: cancellationToken))
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var passwordHash = passwordHasher.Hash(request.Password);
        var user = new User(request.Name, request.Email, passwordHash, request.Role);

        await users.AddAsync(user, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return UserMapping.ToResponse(user);
    }
}
