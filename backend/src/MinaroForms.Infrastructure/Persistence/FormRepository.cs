using Microsoft.EntityFrameworkCore;
using MinaroForms.Application.Abstractions;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Infrastructure.Persistence;

public sealed class FormRepository(FormsDbContext dbContext) : IFormRepository
{
    public async Task AddAsync(Form form, CancellationToken cancellationToken = default)
    {
        await dbContext.Forms.AddAsync(form, cancellationToken);
    }

    public Task<Form?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return dbContext.Forms
            .Include(form => form.Questions)
            .ThenInclude(question => question.Options)
            .Include(form => form.Submissions)
            .ThenInclude(submission => submission.Answers)
            .FirstOrDefaultAsync(form => form.Id == id, cancellationToken);
    }
}
