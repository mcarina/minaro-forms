using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MinaroForms.Application.Abstractions;
using MinaroForms.Infrastructure.Persistence;
using MinaroForms.Infrastructure.Security;

namespace MinaroForms.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Database")
            ?? throw new InvalidOperationException("Connection string 'Database' was not found.");

        services.AddDbContext<FormsDbContext>(options =>
            options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

        services.AddScoped<IFormRepository, FormRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
