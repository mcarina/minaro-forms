using MinaroForms.Application.Abstractions;

namespace MinaroForms.Application.Forms.GetFormsByUser;

public sealed class GetFormsByUserUseCase
{
    private readonly IFormRepository _repository;

    public GetFormsByUserUseCase(IFormRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<GetFormsByUserResponse>> ExecuteAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _repository.GetByUserIdAsync(
            userId,
            cancellationToken
        );
    }
}