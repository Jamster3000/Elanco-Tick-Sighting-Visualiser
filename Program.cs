using TickVisuilzer_Backend.Service;
using TickVisuilzer_Backend.SQL;
using TickVisualizer_Backend.Models;
using ElantroProj.Service;

namespace ElantroProj
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpClient();

            builder.Services.AddScoped<TickSQL>(provider =>
            {
                var connectionString = builder.Configuration.GetConnectionString("TickDb");
                return new TickSQL(connectionString);
            });

            builder.Services.AddScoped<AuthSQL>(provider =>
            {
                var connectionString = builder.Configuration.GetConnectionString("TickDb");
                return new AuthSQL(connectionString);
            });

            builder.Services.AddScoped<TickService>();
            builder.Services.AddSingleton<MapService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            var mapService = app.Services.GetRequiredService<MapService>();
            var basePath = AppContext.BaseDirectory;
            mapService.LoadDataAsync(
                Path.Combine(basePath, "uk_postcodes.csv"),
                Path.Combine(basePath, "uk_places.csv"),
                Path.Combine(basePath, "uk_boundaries.json")
            ).Wait();

            app.UseStaticFiles();
            app.UseCors("AllowFrontend");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}