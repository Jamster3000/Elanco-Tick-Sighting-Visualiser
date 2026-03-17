using Microsoft.EntityFrameworkCore;
using TickVisualizer_Backend.Models;

namespace ElantroProj.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<TickSighting> TickSightings { get; set; }
    }
}