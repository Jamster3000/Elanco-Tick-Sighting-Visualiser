using System.Text.Json.Serialization;

namespace TickVisualizer_Backend.Models
{
    public class TickSpecies
    {
        [JsonPropertyName("SPECIES_ID")]
        public int Id { get; set; }

        [JsonPropertyName("SPECIES")]
        public string TickName { get; set; } = "";

        [JsonPropertyName("LATIN")]
        public string LatinName { get; set; } = "";

        [JsonPropertyName("BIO_CHARACTERISTIC")]
        public string BioCharacteristics { get; set; } = "";

        [JsonPropertyName("TYPICAL_HABITAT")]
        public string TypicalHabitat { get; set; } = "";

        [JsonPropertyName("HEALTH_RISKS")]
        public string HealthRisks { get; set; } = "";
    }
}
