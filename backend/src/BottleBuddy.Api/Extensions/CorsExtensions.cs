using Microsoft.AspNetCore.Cors.Infrastructure;

namespace BottleBuddy.Api.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddCorsConfiguration(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                ConfigureCorsPolicy(policy, configuration, environment);
            });
        });

        return services;
    }

    private static void ConfigureCorsPolicy(CorsPolicyBuilder policy, IConfiguration configuration, IWebHostEnvironment environment)
    {
        if (environment.IsDevelopment())
        {
            // Development: Allow localhost origins
            policy.WithOrigins(
                    "http://localhost:8080",
                    "http://localhost:8081",
                    "http://localhost:5173",
                    "http://localhost:3000"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
        else
        {
            // Production/Staging: Allow configured origins
            var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

            if (allowedOrigins is { Length: > 0 })
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            }
            else
            {
                // SECURITY: Fail fast if CORS origins are not configured in production
                throw new InvalidOperationException(
                    "CORS origins must be configured in production. " +
                    "Please set 'Cors:AllowedOrigins' in appsettings.json or environment variables.");
            }
        }
    }
}