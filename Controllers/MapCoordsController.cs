using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/map")]
    public class MapController : ControllerBase
    {
        private readonly HttpClient _http;

        public MapController(HttpClient http)
        {
            _http = http;

            // Required by Nominatim
            _http.DefaultRequestHeaders.UserAgent.ParseAdd("ElantroProjTickMap/1.0 (student project)");
        }

        [HttpGet("reverse")]
        public async Task<IActionResult> Reverse(double lat, double lon)
        {
            Console.WriteLine($"Received reverse geocoding request for ({lat}, {lon})");
            var url = $"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&zoom=10&addressdetails=1";

            var response = await _http.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode);

            var json = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Reverse geocoding for ({lat}, {lon}): {json}");

            return Content(json, "application/json");
        }
    }
}