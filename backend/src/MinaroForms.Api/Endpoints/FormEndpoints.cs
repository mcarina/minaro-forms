using MinaroForms.Application.Forms.CreateForm;
using MinaroForms.Application.Forms.GetForm;
using MinaroForms.Application.Forms.PublishForm;
using MinaroForms.Application.Submissions.CreateSubmission;
using MinaroForms.Application.Forms.GetFormsByUser;
using System.Security.Claims;

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
            PublishFormUseCase useCase,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var form = await useCase.ExecuteAsync(formId, cancellationToken);
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

        return app;
    }
}
