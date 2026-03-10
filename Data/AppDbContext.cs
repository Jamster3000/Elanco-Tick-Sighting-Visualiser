using Microsoft.EntityFrameworkCore;
using ElantroProj.Models;

namespace ElantroProj.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<TickSightings> Tick_Sightings { get; set; }
    }
}