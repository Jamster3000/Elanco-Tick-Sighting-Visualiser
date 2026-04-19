using Microsoft.AspNetCore.Mvc;
using ElantroProj.Models;
using ElantroProj.Service;
using System.Net.NetworkInformation;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/map")]
    public class MapController : ControllerBase
    {
        private readonly HttpClient _http;
        private readonly MapService _mapService;

        public MapController(MapService mapService)
        {
            _mapService = mapService;
        }

        [HttpGet("reverse")]
        public IActionResult Reverse(double lat, double lon)
        {
            var closest = _mapService.GetAllLocations()
                .Where(l => l.LocationType == "City")
                .OrderBy(l => Haversine(lat, lon, l.cityLatitude, l.cityLongitude))
                .FirstOrDefault();

            if (closest == null) return NotFound();

            return Ok(new
            {
                address = new { city = closest.Name }
            });
        }

        [HttpGet("postcodes")]
        public IActionResult GetPostcode(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query parameter is required");
            }

            var postcode = _mapService.GetPostcode(query.ToUpper());

            return Ok(new
            {
                result = new
                {
                    postcode = postcode.Postcode,
                    latitude = postcode.PostcodeLatitude,
                    longitude = postcode.PostcodeLongitude
                }
            });
        }

        [HttpGet("city-polygon")]
        public IActionResult GetCityPolygon(string city)
        {
            if (string.IsNullOrEmpty(city))
            {
                return BadRequest("City parameter is required");
            }

            var boundary = _mapService.GetBoundaryByName(city);
            if (boundary == null)
            {
                return NotFound($"Boundary not found for city: {city}");
            }

            //uses london's coords as fallback if anything went wrong at this point
            double lat = 51.5074;
            double lon = -0.1278;

            if (boundary.Geometry?.Coordinates != null)
            {
                try
                {
                    var coordElement = boundary.Geometry.Coordinates;
                    var coords = System.Text.Json.JsonSerializer.Deserialize<double[][][][]>(coordElement.GetRawText());

                    if (coords?.Length > 0 && coords[0]?.Length > 0 && coords[0][0]?.Length >= 2)
                    {
                        lon = coords[0][0][0][0];
                        lat = coords[0][0][0][1];
                    }
                }
                catch { }
            }

            return Ok(new
            {
                boundary,
                lat,
                lon,
                polygon = boundary.Geometry
            });
        }

        //researched Haversine formula
        //https://stackoverflow.com/questions/41621957/a-more-efficient-haversine-function

        private static double Haversine(double lat1, double lon1, double lat2, double lon2)
        {
            const double r = 6378100; // meters

            var sdlat = Math.Sin((lat2 - lat1) / 2);
            var sdlon = Math.Sin((lon2 - lon1) / 2);
            var q = sdlat * sdlat + Math.Cos(lat1) * Math.Cos(lat2) * sdlon * sdlon;
            var d = 2 * r * Math.Asin(Math.Sqrt(q));

            return d;
        }
    }
}