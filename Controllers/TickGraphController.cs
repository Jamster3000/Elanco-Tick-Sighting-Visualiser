using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("GetYearlyData")] //this is for TickHistory line chart
        public async Task<IActionResult> GetYearlyData([FromQuery] string species)
        {

            var allSightings = await _tickService.GetTickSightings(); //gets all sightings

            var speciesSightings = allSightings
                .Where(s => s.Species.Equals(species, StringComparison.OrdinalIgnoreCase)) //all sightings for a given species
                .ToList();

            var yearlyCounts = speciesSightings
                .Where(t => !string.IsNullOrWhiteSpace(t.Date))
                .GroupBy(t => { //group records for given species by year
                    if (DateTime.TryParse(t.Date, out var parsed))
                        return parsed.Year;
                    return 0;
                })
                .Where(g => g.Key != 0)
                .Select(g => new
                {
                    year = g.Key,
                    count = g.Count()
                })
                .OrderBy(x => x.year)
                .ToList();

            return Ok(new
            {
                year = yearlyCounts
            });
        }

        [HttpGet("GetAllCities")]
        public async Task<IActionResult> GetAllCities()
        {
            var allSightings = await _tickService.GetTickSightings();

            var cities = allSightings
                .Where(t => !string.IsNullOrWhiteSpace(t.LocationName))
                .Select(t => new { city = t.LocationName })
                .Distinct()
                .ToList();

            return Ok(cities);
        }
    }
}