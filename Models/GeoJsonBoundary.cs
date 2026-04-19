using System.Text.Json;
using System.Text.Json.Serialization;

namespace ElantroProj.Models
{
    public class GeoJsonFeatureCollection
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "FeatureCollection";

        [JsonPropertyName("features")]
        public List<GeoJsonFeature> Features { get; set; } = new();
    }

    public class GeoJsonFeature
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "Feature";

        [JsonPropertyName("properties")]
        public Dictionary<string, object?> Properties { get; set; } = new();

        [JsonPropertyName("geometry")]
        public GeoJsonGeometry? Geometry { get; set; }
    }

    public class GeoJsonGeometry
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "";

        [JsonPropertyName("coordinates")]
        public JsonElement Coordinates { get; set; }
    }

    public class BoundaryItem
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("original_name")]
        public string OriginalName { get; set; } = "";

        [JsonPropertyName("polygon")]
        public GeoJsonGeometry? Polygon { get; set; }
    }
}