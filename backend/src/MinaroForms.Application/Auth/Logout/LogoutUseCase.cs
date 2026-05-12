namespace MinaroForms.Application.Auth.Logout;

public sealed class LogoutUseCase
{
    public Task ExecuteAsync(CancellationToken cancellationToken = default)
    {
        return Task.CompletedTask;
    }
}
