using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElantroProj.Data;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TickSightingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TickSightingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TickSightings/city/(any city)
        [HttpGet("city/{city}")]
        public async Task<IActionResult> GetSightingsByCity(string city)
        {
            var count = await _context.Tick_Sightings
                .Where(t => t.Location == city)
                .CountAsync();

            var speciesList = await _context.Tick_Sightings
                .Where(t => t.Location == city)
                .Select(t => t.Species)
                .Distinct()
                .ToListAsync();

            var latestSighting = await _context.Tick_Sightings
                .Where(t => t.Location == city)
                .OrderByDescending(t => t.Date)
                .FirstOrDefaultAsync();

            var latestDate = latestSighting?.Date;

            return Ok(new
            {
                City = city,
                SightingsCount = count,
                Species = speciesList,
                LatestDate = latestDate
            });
        }
    }
}