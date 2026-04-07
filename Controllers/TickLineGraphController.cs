using Microsoft.AspNetCore.Mvc;
using TickVisuilzer_Backend.Service;
using System.Globalization;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TickLineGraphController : ControllerBase
    {
        private readonly TickService _tickService;

        public TickLineGraphController(TickService tickService)
        {
            _tickService = tickService;
        }

        [HttpGet("GetLineGraphData/{city}")]
        public async Task<IActionResult> GetLineChartData(string city)
        {
            var allSightings = await _tickService.GetTickSightings();

            var citySightings = allSightings
                .Where(t => t.LocationName == city)
                .ToList();

            var parsedData = citySightings
                .Select(t =>
                {
                    DateTime parsedDate;
                    bool success = DateTime.TryParseExact(
                        t.Date,
                        new[] { "d MMMM yyyy, HH:mm", "dd MMMM yyyy, HH:mm" },
                        CultureInfo.InvariantCulture,
                        DateTimeStyles.None,
                        out parsedDate
                    );

                    return new
                    {
                        Species = t.Species,
                        Year = success ? parsedDate.Year : (int?)null
                    };
                });

            var result = parsedData
                .GroupBy(x => new { x.Year, x.Species })
                .Select(g => new
                {
                    year = g.Key.Year,
                    species = g.Key.Species,
                    count = g.Count()
                })
                .OrderBy(x => x.year)
                .ToList();

            return Ok(result);
        }
    }
}