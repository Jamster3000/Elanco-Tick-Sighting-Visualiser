using TickVisuilzer_Backend.Service;
using TickVisuilzer_Backend.SQL;
using TickVisualizer_Backend.Models;

namespace ElantroProj
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
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

            app.UseStaticFiles();

            app.UseCors("AllowFrontend");

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            //app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}