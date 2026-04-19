using System.Text.Json.Serialization;

namespace ElantroProj.Models
{
    public class MapPostcode
    {
        [JsonPropertyName("postcode")]
        public string Postcode { get; set; }

        [JsonPropertyName("plat")]
        public double PostcodeLatitude { get; set; }

        [JsonPropertyName("plng")]
        public double PostcodeLongitude { get; set; }
    }
}
