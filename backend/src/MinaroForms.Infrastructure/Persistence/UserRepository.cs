using Microsoft.EntityFrameworkCore;
using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Users;

namespace MinaroForms.Infrastructure.Persistence;

public sealed class UserRepository(FormsDbContext dbContext) : IUserRepository
{
    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await dbContext.Users.AddAsync(user, cancellationToken);
    }

    public async Task<IReadOnlyCollection<User>> ListAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Users
            .OrderBy(user => user.Name)
            .ThenBy(user => user.Email)
            .ToArrayAsync(cancellationToken);
    }

    public Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return dbContext.Users.FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = NormalizeEmail(email);
        return dbContext.Users.FirstOrDefaultAsync(user => user.Email == normalizedEmail, cancellationToken);
    }

    public Task<bool> ExistsByEmailAsync(
        string email,
        Guid? ignoredUserId = null,
        CancellationToken cancellationToken = default)
    {
        var normalizedEmail = NormalizeEmail(email);

        return dbContext.Users.AnyAsync(
            user => user.Email == normalizedEmail && (!ignoredUserId.HasValue || user.Id != ignoredUserId.Value),
            cancellationToken);
    }

    private static string NormalizeEmail(string email)
    {
        return string.IsNullOrWhiteSpace(email) ? string.Empty : email.Trim().ToLowerInvariant();
    }
}
