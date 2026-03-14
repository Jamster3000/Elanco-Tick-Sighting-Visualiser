using FuzzySharp;
using Microsoft.VisualBasic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using TickVisualizer_Backend.Models;
using TickVisuilzer_Backend.Models;
using TickVisuilzer_Backend.SQL;

namespace TickVisuilzer_Backend.Service
{
    public class TickService
    {
        private readonly TickSQL _tickSQL;
        private List<string> LocationNames = new List<string>();
        private static readonly string[] DateFormats = {
            "yyyy-MM-ddTHH:mm:ss",
            "yyyy-MM-dd HH:mm:ss",
            "yyyy-MM-dd",
            "dd/MM/yyyy",
            "MM/dd/yyyy",
            "dd-MM-yyyy",
        };

        public TickService(TickSQL tickSQL)
        {
            _tickSQL = tickSQL;
        }

        public string CleanLocationNames(string name, List<string> cleanNames)
        {
            if (name == null || name == "null") return "";

            var process = FuzzySharp.Process.ExtractOne(name, cleanNames);

            if (name == process.Value || process.Score == 100)
            {
                return name;
            }

            if (process.Score >= 80)
            {
                return process.Value;
            }

            return process.Value;
        }

        public string? CleanTickName(string? latin, List<string> latinNames)
        {
            if (latin == null || latin == "null") return null;

            var process = FuzzySharp.Process.ExtractOne(latin, latinNames);    

            if (latin == process.Value || process.Score == 100) return process.Value;

            if (process.Score >= 80)
            {
                return process.Value;
            }

            return latin;
        }

        public string CleanSecondSpeciesName(string speciesName)
        {
            string[] splitName = speciesName.Split('/');

            return splitName[0] + " tick";
        }

        public string? FormatDate(string? date)
        {
            if (string.IsNullOrWhiteSpace(date)) return null;

            if (DateTime.TryParseExact(date.Trim(), DateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result) || DateTime.TryParse(date.Trim(), out result))
            {
                return result.ToString("d MMMM yyyy, HH:mm");
            }

            return null;
        }

        public async Task<IEnumerable<TickSighting>> GetTickSightings()
        {
            var sightings = (await _tickSQL.GetTickSightings()).ToList();
            var frequencies = (await _tickSQL.GetLocationNameFrequencies()).ToList();
            var mapping = (await _tickSQL.GetTickMapping())
                .Select(t => t.LatinName)
                .ToList();

            //Sort the frequences of the cities from highest to lowest
            var sorted = frequencies.OrderBy(f => f.Frequency).ToList();

            //Finds the natural biggest gap in frequences and sets the cutoff there
            // so the bottom half of the cutoff are considered potential mis-spellings
            int cutoffIndex = 0;
            int biggestGap = 0;
            for (int i = 1; i < sorted.Count; i++)
            {
                var gap = sorted[i].Frequency - sorted[i - 1].Frequency;
                if (gap > biggestGap)
                {
                    biggestGap = gap;
                    cutoffIndex = i;
                }
            }

            var cutoff = sorted[cutoffIndex].Frequency;

            //Location names that appear more than 5 times (exect spelling) - these are considered the correct spellings
            var cleanNames = frequencies
                .Where(f => f.Frequency > cutoff)
                .Select(f => f.Name)
                .ToList();

            //Words that appear less than 5 times are considered missspellings to check against clean names
            var misspelt = new HashSet<string>(frequencies
                .Where(f => f.Frequency <= cutoff)
                .Select(f => f.Name));

            //By creating dictionaries and keepign the fuzzy matching functions out of the loop
            //it only fuzzy matches on unique strings rather than all occurances of all strings that apply
            var MisspeltMap = misspelt.ToDictionary(
                name => name,
                name => CleanLocationNames(name, cleanNames)
            );

            var latinCorrectionMap = sightings
                .Where(s => s.Latin != null)
                .Select(s => s.Latin!)
                .Distinct()
                .ToDictionary(
                    latin => latin,
                    latin => CleanTickName(latin, mapping)
                );

            foreach (var sighting in sightings)
            {
                if (MisspeltMap.TryGetValue(sighting.LocationName, out var correctedLocation))
                {
                    sighting.LocationName = correctedLocation;
                }

                if (sighting.Species.Contains("/"))
                {
                    sighting.Species = CleanSecondSpeciesName(sighting.Species);
                }

                if (sighting.Latin != null && latinCorrectionMap.TryGetValue(sighting.Latin, out var correctedLatin))
                {
                    sighting.Latin = correctedLatin;
                }

                sighting.Date = FormatDate(sighting.Date);
            }

            return sightings;
        }
    }
}
