using System.Text.Json.Serialization;

namespace ElantroProj.Models
{
    public class BoundaryMappings
    {
        [JsonPropertyName("tick_city_name")]
        public string? TickCityName { get; set; }

        [JsonPropertyName("boundary_name")]
        public string? BoundaryName { get; set; }
    }
}
