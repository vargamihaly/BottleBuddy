using System.Diagnostics;
using System.Security.Claims;
using BottleBuddy.Api;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Extensions;
using BottleBuddy.Api.Middleware;
using BottleBuddy.Api.Services;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Enrichers.Activity;
using Serilog.Formatting.Compact;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Async(writeTo => writeTo.Console(new RenderedCompactJsonFormatter()))
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting BottleBuddy API host");

    var builder = WebApplication.CreateBuilder(args);

    builder.Logging.ClearProviders();

    builder.Host.UseSerilog((context, services, loggerConfiguration) =>
    {
        loggerConfiguration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Application", context.HostingEnvironment.ApplicationName)
            .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
            .Enrich.WithProcessId()
            .Enrich.WithThreadId()
            .Enrich.With<ActivityEnricher>()
            .WriteTo.Async(writeTo => writeTo.Console(new RenderedCompactJsonFormatter()));
    });

    // Add services to the container
    builder.Services.AddControllers();

    // Database
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

    // Authentication & Authorization
    builder.Services.AddAuthenticationConfiguration(builder.Configuration);

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins("http://localhost:8080", "http://localhost:8081")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    // Register application services
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IBottleListingService, BottleListingService>();
    builder.Services.AddScoped<ITransactionService, TransactionService>();
    builder.Services.AddScoped<IRatingService, RatingService>();
    builder.Services.AddScoped<PickupRequestService>();

    // Swagger/OpenAPI
    builder.Services.AddSwaggerDocumentation();

    var app = builder.Build();

    // Configure the HTTP request pipeline
    if (app.Environment.IsDevelopment())
    {
        app.UseSwaggerDocumentation();
    }

    app.UseSerilogRequestLogging(options =>
    {
        options.IncludeQueryInRequestPath = true;
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            var activity = Activity.Current;
            if (activity is not null)
            {
                diagnosticContext.Set("TraceId", activity.TraceId.ToString());
                diagnosticContext.Set("SpanId", activity.SpanId.ToString());

                if (activity.ParentSpanId != ActivitySpanId.Empty)
                {
                    diagnosticContext.Set("ParentSpanId", activity.ParentSpanId.ToString());
                }
            }

            diagnosticContext.Set("ClientIP", httpContext.Connection.RemoteIpAddress?.ToString());
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
            diagnosticContext.Set("RequestPath", httpContext.Request.Path);
            diagnosticContext.Set("CorrelationId", httpContext.TraceIdentifier);

            var userId = httpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
            {
                diagnosticContext.Set("UserId", userId);
            }
        };
    });

    app.UseGlobalExceptionHandler();
    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();

    // Map controllers
    app.MapControllers();

    // Run database migrations and seed sample data
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();

        try
        {
            // Run database migrations
            logger.LogInformation("Applying database migrations");
            var context = services.GetRequiredService<ApplicationDbContext>();
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migrations applied successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to apply database migrations");
            throw; // Re-throw to prevent app from starting with broken database
        }

        try
        {
            // Seed sample data
            await SeedData.Initialize(services);
            logger.LogInformation("Database seeding completed");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Database seeding encountered a recoverable error");
            // Don't throw - app can run without seed data
        }
    }

    app.Run();

    Log.Information("BottleBuddy API host stopped gracefully");
}
catch (Exception ex)
{
    Log.Fatal(ex, "BottleBuddy API host terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
