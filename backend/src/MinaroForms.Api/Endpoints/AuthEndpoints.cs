using MinaroForms.Infrastructure.Security;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using MinaroForms.Application.Auth.Login;
using MinaroForms.Application.Auth.Logout;

namespace MinaroForms.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var auth = app.MapGroup("/api/auth")
            .WithTags("Auth");

        auth.MapPost("/login", async (
            LoginRequest request,
            LoginUseCase useCase,
            JwtTokenGenerator jwtGenerator,
            CancellationToken cancellationToken) =>
        {
            var login = await useCase.ExecuteAsync(
                request,
                cancellationToken
            );

            if (login is null)
            {
                return Results.Unauthorized();
            }

            var token = jwtGenerator.GenerateToken(login.User);

            return Results.Ok(new
            {
                token
            });
        });

        return app;
    }
}
