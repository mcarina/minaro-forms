using MinaroForms.Application.Abstractions;

namespace MinaroForms.Infrastructure.Persistence;

public sealed class UnitOfWork(FormsDbContext dbContext) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return dbContext.SaveChangesAsync(cancellationToken);
    }
}
