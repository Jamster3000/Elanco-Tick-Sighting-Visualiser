using System.Text.Json.Serialization;

namespace TickVisualizer_Backend.Models
{
    public class TickSighting
    {
        [JsonPropertyName("SOURCE_ID")]
        public string? SourceId { get; set; }

        [JsonPropertyName("DATE")]
        public string? Date { get; set; }

        [JsonPropertyName("NAME")]
        public string? LocationName { get; set; }

        [JsonPropertyName("LAT")]
        public double? Lat { get; set; }

        [JsonPropertyName("LONG")]
        public double? Long { get; set; }

        [JsonPropertyName("SPECIES")]
        public string? Species { get; set; }

        [JsonPropertyName("LATIN")]
        public string? Latin { get; set; }
    }
}