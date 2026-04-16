using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TickVisualizer_Backend.Models;
using TickVisuilzer_Backend.Service;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TickSightingsController : ControllerBase
    {
        private readonly TickService _tickService;

        public TickSightingsController(TickService tickService)
        {
            _tickService = tickService;
        }

        // GET: api/TickSightings/city/(any city)
        [HttpGet("city/{city}")]
        public async Task<IActionResult> GetSightingsByCity(string city)
        {
            var allSightings = await _tickService.GetTickSightings();
            var citySightings = allSightings.Where(t => t.LocationName == city).ToList();

            var count = citySightings.Count;
            var speciesList = citySightings
                .Select(t => t.Species)
                .Distinct()
                .ToList();
            var latestDate = citySightings
                .OrderByDescending(t => t.Date)
                .FirstOrDefault()?.Date;

            return Ok(new
            {
                City = city,
                SightingsCount = count,
                Species = speciesList,
                LatestDate = latestDate
            });
        }

        [HttpGet("species/{species}/percentage-change")]

        public async Task <IActionResult> GetPercentageChange(string species)
        {
            var PercentageChangeResult = await _tickService.GetPercentageChangeBySpecies(species);
            return Ok(PercentageChangeResult);
        }
    }
}