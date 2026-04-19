using System.Text.Json.Serialization;

namespace TickVisualizer_Backend.Models
{
    public class Location
    {
        [JsonPropertyName("LOCATION_ID")]
        public int Id { get; set; }

        [JsonPropertyName("NAME")]
        public string? Name { get; set; }

        [JsonPropertyName("LAT")]
        public double? Lat { get; set; }

        [JsonPropertyName("LONG")]
        public double? Long { get; set; }
    }
}