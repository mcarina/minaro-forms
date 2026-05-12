using MinaroForms.Application.Users.CreateUser;
using MinaroForms.Application.Users.GetUser;
using MinaroForms.Application.Users.ListUsers;
using MinaroForms.Application.Users.UpdateUser;

namespace MinaroForms.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var users = app.MapGroup("/api/users").WithTags("Users");

        users.MapGet("/", async (
            ListUsersUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var result = await useCase.ExecuteAsync(cancellationToken);
            return Results.Ok(result);
        });

        users.MapGet("/{userId:guid}", async (
            Guid userId,
            GetUserUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var user = await useCase.ExecuteAsync(userId, cancellationToken);
            return user is null ? Results.NotFound() : Results.Ok(user);
        });

        users.MapPost("/", async (
            CreateUserRequest request,
            CreateUserUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var user = await useCase.ExecuteAsync(request, cancellationToken);
                return Results.Created($"/api/users/{user.Id}", user);
            }
            catch (ArgumentException exception)
            {
                return Results.BadRequest(new { error = exception.Message });
            }
            catch (InvalidOperationException exception)
            {
                return Results.Conflict(new { error = exception.Message });
            }
        });

        users.MapPut("/{userId:guid}", async (
            Guid userId,
            UpdateUserRequest request,
            UpdateUserUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var user = await useCase.ExecuteAsync(userId, request, cancellationToken);
                return user is null ? Results.NotFound() : Results.Ok(user);
            }
            catch (ArgumentException exception)
            {
                return Results.BadRequest(new { error = exception.Message });
            }
            catch (InvalidOperationException exception)
            {
                return Results.Conflict(new { error = exception.Message });
            }
        });

        return app;
    }
}
