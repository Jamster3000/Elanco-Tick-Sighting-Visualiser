using Microsoft.AspNetCore.Mvc;
using TickVisuilzer_Backend.Service;

namespace TickVisuilzer_Backend.Controllers
{
    [ApiController]
    [Route("api/DataCleaning")]
    public class DataCleaning : Controller
    {
        private readonly TickService _tickService;

        public DataCleaning(TickService tickService)
        {
            _tickService = tickService;
        }

        [HttpGet]
        public IActionResult GetSightings()
        {
            var results = _tickService.GetTickSightings();
            //var results = _tickService.GetLocationNameFrequencies();
            return Ok(results);
        }
    }
}
