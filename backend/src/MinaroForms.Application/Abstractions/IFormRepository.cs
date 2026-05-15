using MinaroForms.Application.Forms.GetFormsByUser;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Abstractions;

public interface IFormRepository
{
    Task AddAsync(Form form, CancellationToken cancellationToken = default);
    Task<Form?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<GetFormsByUserResponse>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}
