using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;
using MinaroForms.Api.Endpoints;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi.Models;
using MinaroForms.Application.Auth.Login;
using MinaroForms.Application.Auth.Logout;
using MinaroForms.Application.Forms.CreateForm;
using MinaroForms.Application.Forms.GetForm;
using MinaroForms.Application.Forms.PublishForm;
using MinaroForms.Application.Submissions.CreateSubmission;
using MinaroForms.Application.Users.CreateUser;
using MinaroForms.Application.Users.GetUser;
using MinaroForms.Application.Users.ListUsers;
using MinaroForms.Application.Users.UpdateUser;
using MinaroForms.Infrastructure;
using MinaroForms.Infrastructure.Persistence;
using MinaroForms.Infrastructure.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<CreateFormUseCase>();
builder.Services.AddScoped<GetFormUseCase>();
builder.Services.AddScoped<PublishFormUseCase>();
builder.Services.AddScoped<CreateSubmissionUseCase>();
builder.Services.AddScoped<LoginUseCase>();
builder.Services.AddScoped<LogoutUseCase>();
builder.Services.AddScoped<CreateUserUseCase>();
builder.Services.AddScoped<GetUserUseCase>();
builder.Services.AddScoped<ListUsersUseCase>();
builder.Services.AddScoped<UpdateUserUseCase>();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "minaro_forms_auth";
        options.LoginPath = "/api/auth/login";
        options.LogoutPath = "/api/auth/logout";
    });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtTokenGenerator>();
builder.Services.AddHealthChecks();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MinaroForms API",
        Version = "1.0"
    });

    options.MapType<JsonElement>(() => new OpenApiSchema
    {
        Type = "object",
        AdditionalPropertiesAllowed = true
    });

    options.MapType<JsonElement?>(() => new OpenApiSchema
    {
        Type = "object",
        Nullable = true,
        AdditionalPropertiesAllowed = true
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "MinaroForms API");
    });
}

// await using (var scope = app.Services.CreateAsyncScope())
// {
//     var dbContext = scope.ServiceProvider.GetRequiredService<FormsDbContext>();
//     await dbContext.Database.EnsureCreatedAsync();
// }

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapFormEndpoints();
app.MapUserEndpoints();
app.MapAuthEndpoints();

app.Run();
