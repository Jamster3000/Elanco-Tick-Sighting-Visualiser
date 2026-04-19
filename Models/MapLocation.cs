using System.Text.Json.Serialization;

namespace ElantroProj.Models
{
    public class MapLocation
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("location_type")]
        public string? LocationType { get; set; }

        [JsonPropertyName("lat")]
        public double cityLatitude { get; set; }

        [JsonPropertyName("lng")]
        public double cityLongitude { get; set; }
    }
}
