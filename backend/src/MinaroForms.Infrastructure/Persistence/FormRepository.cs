using MinaroForms.Application.Forms.GetFormsByUser;
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

    public async Task<List<GetFormsByUserResponse>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await dbContext.Forms
            .Where(form => form.OwnerUserId == userId)
            .OrderByDescending(form => form.UpdatedAt)
            .Select(form => new GetFormsByUserResponse
            {
                Id = form.Id,

                Title = form.Title,

                Description = form.Description,

                AnswersCount = form.Submissions.Count,

                LastUpdate = form.UpdatedAt
                    .ToString("dd/MM/yyyy"),

                IsFavorite = false
            })
            .ToListAsync(cancellationToken);
    }

}
