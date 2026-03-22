using Microsoft.AspNetCore.Mvc;
using TickVisuilzer_Backend.Service;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TickChartController : ControllerBase
    {
        private readonly TickService _tickService;

        public TickChartController(TickService tickService)
        {
            _tickService = tickService;
        }

        // GET: api/TickChart/GetChartData/London
        [HttpGet("GetChartData/{city}")]
        public async Task<IActionResult> GetTickChartData(string city)
        {
            // Get all sightings 
            var allSightings = await _tickService.GetTickSightings();

            var citySightings = allSightings
                .Where(t => t.LocationName == city)
                .ToList();

            var totalCount = citySightings.Count;

            // Group by species, quite sure this is what AG charts wants
            var speciesCounts = citySightings
                .GroupBy(t => t.Species)
                .Select(g => new
                {
                    species = g.Key,
                    count = g.Count()
                })
                .ToList();

            var latestDate = citySightings
                .OrderByDescending(t => t.Date)
                .FirstOrDefault()?.Date;

            return Ok(new
            {
                city = city,
                sightingsCount = totalCount,
                species = speciesCounts,
                latestDate = latestDate
            });
        }
    }
}