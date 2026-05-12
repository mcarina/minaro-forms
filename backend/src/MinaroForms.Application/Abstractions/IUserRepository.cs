using MinaroForms.Domain.Users;

namespace MinaroForms.Application.Abstractions;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<User>> ListAsync(CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(string email, Guid? ignoredUserId = null, CancellationToken cancellationToken = default);
}
