using helpdesk_utp.auth.Data;
using helpdesk_utp.auth.Models;
using helpdesk_utp.auth.Repositories;
using helpdesk_utp.auth.Services;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? ["http://localhost:5173"];

// OpenTelemetry Configuration
const string serviceName = "helpdesk-utp.auth";

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddOtlpExporter())
    // .AddConsoleExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddPrometheusExporter());
// .AddConsoleExporter());

builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName));
    options.AddConsoleExporter();
});

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Dependencies
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

// AUTH Endpoints
var authGroup = app.MapGroup("/auth");

authGroup.MapPost("/login", async (LoginRequest request, IAuthService authService, ILogger<Program> logger) =>
{
    logger.LogInformation("Login attempt for user: {Email}", request.Email);
    var response = await authService.LoginAsync(request);

    if (response is not null)
    {
        logger.LogInformation("Login successful for user: {Email}", request.Email);
        return Results.Ok(response);
    }

    logger.LogWarning("Login failed for user: {Email}", request.Email);
    return Results.Unauthorized();
});

authGroup.MapPost("/logout", async (IAuthService authService, ILogger<Program> logger) =>
{
    logger.LogInformation("Logout request received");
    await authService.LogoutAsync();
    logger.LogInformation("Logout successful");
    return Results.Ok(new { message = "Logged out successfully" });
});

app.Run();