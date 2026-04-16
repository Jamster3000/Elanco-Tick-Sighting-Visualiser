using Microsoft.AspNetCore.Mvc;
using TickVisuilzer_Backend.Service;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/tick")]
    public class TickInformationController: Controller
    {
        private readonly TickService _tickService;

        public TickInformationController(TickService tickService)
        {
            _tickService = tickService;
        }

        [HttpGet("species")]
        public async Task<IActionResult> GetAllSpecies()
        {
            var species = await _tickService.GetAllTickSpecies();
            return Ok(species);
        }
    }
}
