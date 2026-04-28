using MinaroForms.Domain.Forms;

namespace MinaroForms.Application.Abstractions;

public interface IFormRepository
{
    Task AddAsync(Form form, CancellationToken cancellationToken = default);
    Task<Form?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
