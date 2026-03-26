using Microsoft.AspNetCore.Mvc;
using TickVisuilzer_Backend.Service;

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

            var result = citySightings
                .GroupBy(t => new
                {
                    Year = int.Parse(t.Date.Substring(0, 4)),
                    t.Species
                })
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