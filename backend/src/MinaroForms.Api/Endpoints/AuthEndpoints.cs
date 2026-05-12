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
        var auth = app.MapGroup("/api/auth").WithTags("Auth");

        auth.MapPost("/login", async (
            LoginRequest request,
            LoginUseCase useCase,
            HttpContext httpContext,
            CancellationToken cancellationToken) =>
        {
            var login = await useCase.ExecuteAsync(request, cancellationToken);
            if (login is null)
            {
                return Results.Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, login.User.Id.ToString()),
                new Claim(ClaimTypes.Name, login.User.Name),
                new Claim(ClaimTypes.Email, login.User.Email),
                new Claim(ClaimTypes.Role, login.User.Role)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Results.Ok(login);
        });

        auth.MapPost("/logout", async (
            LogoutUseCase useCase,
            HttpContext httpContext,
            CancellationToken cancellationToken) =>
        {
            await useCase.ExecuteAsync(cancellationToken);
            await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Results.NoContent();
        });

        return app;
    }
}
