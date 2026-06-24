using MinaroForms.Application.Forms.CreateForm;
using MinaroForms.Application.Forms.GetForm;
using MinaroForms.Application.Forms.PublishForm;
using MinaroForms.Application.Submissions.CreateSubmission;
using MinaroForms.Application.Forms.GetFormsByUser;
using System.Security.Claims;
using MinaroForms.Application.Submissions.GetResponsesSummary;

namespace MinaroForms.Api.Endpoints;

public static class FormEndpoints
{
    public static IEndpointRouteBuilder MapFormEndpoints(this IEndpointRouteBuilder app)
    {
        var forms = app.MapGroup("/api/forms").WithTags("Forms");

        forms.MapPost("/", async (
            CreateFormRequest request,
            CreateFormUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var form = await useCase.ExecuteAsync(request, cancellationToken);
                return Results.Created($"/api/forms/{form.Id}", form);
            }
            catch (ArgumentException exception)
            {
                return Results.BadRequest(new { error = exception.Message });
            }
        });

        forms.MapGet("/{formId:guid}", async (
            Guid formId,
            GetFormUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var form = await useCase.ExecuteAsync(formId, cancellationToken);
            return form is null ? Results.NotFound() : Results.Ok(form);
        });

        forms.MapPost("/{formId:guid}/publish", async (
            Guid formId,
            PublishFormRequest request,
            PublishFormUseCase useCase,
            IConfiguration configuration,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var frontendBaseUrl = configuration["Frontend:BaseUrl"]
                    ?? "http://localhost:3000";

                var form = await useCase.ExecuteAsync(
                    formId,
                    request,
                    frontendBaseUrl,
                    cancellationToken);

                return form is null ? Results.NotFound() : Results.Ok(form);
            }
            catch (InvalidOperationException exception)
            {
                return Results.BadRequest(new { error = exception.Message });
            }
        });

        forms.MapPost("/{formId:guid}/submissions", async (
            Guid formId,
            CreateSubmissionRequest request,
            CreateSubmissionUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var submission = await useCase.ExecuteAsync(formId, request, cancellationToken);
                return submission is null
                    ? Results.NotFound()
                    : Results.Created($"/api/forms/{formId}/submissions/{submission.Id}", submission);
            }
            catch (InvalidOperationException exception)
            {
                return Results.BadRequest(new { error = exception.Message });
            }
        });

        forms.MapGet("/me", async (
            ClaimsPrincipal user,
            GetFormsByUserUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                return Results.Unauthorized();
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var forms = await useCase.ExecuteAsync(
                userId,
                cancellationToken
            );

            return Results.Ok(forms);
        })
        .RequireAuthorization();

        //se tiver muitas respostas, eu trocaria o GetByIdAsync por uma query específica no repository para não carregar perguntas
        forms.MapGet("/{formId:guid}/responses/summary", async (
            Guid formId,
            ClaimsPrincipal user,
            GetResponsesSummaryUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                return Results.Unauthorized();
            }

            var userId = Guid.Parse(userIdClaim.Value);

            var summary = await useCase.ExecuteAsync(
                formId,
                userId,
                cancellationToken);

            return summary is null
                ? Results.NotFound()
                : Results.Ok(summary);
        })
        .RequireAuthorization();

        return app;
    }
}
