using Microsoft.AspNetCore.Mvc;

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
            try
            {
                var response = await _http.GetAsync($"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&zoom=10&addressdetails=1");

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode);

                var json = await response.Content.ReadAsStringAsync();
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error calling Nominatim: {ex.Message}");
            }
        }
    }
}