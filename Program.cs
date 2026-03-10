using Microsoft.EntityFrameworkCore;
using ElantroProj.Data;

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

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite("Data Source=Elanco_Dataset.db"));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("vue", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            app.UseCors("vue");

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}