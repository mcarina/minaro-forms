using MinaroForms.Api.Endpoints;
using MinaroForms.Application.Forms.CreateForm;
using MinaroForms.Application.Forms.GetForm;
using MinaroForms.Application.Forms.PublishForm;
using MinaroForms.Application.Submissions.CreateSubmission;
using MinaroForms.Infrastructure;
using MinaroForms.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<CreateFormUseCase>();
builder.Services.AddScoped<GetFormUseCase>();
builder.Services.AddScoped<PublishFormUseCase>();
builder.Services.AddScoped<CreateSubmissionUseCase>();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FormsDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
}

app.MapHealthChecks("/health");
app.MapFormEndpoints();

app.Run();
