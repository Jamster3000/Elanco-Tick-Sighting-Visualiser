using System.Linq;
using FuzzySharp;
using TickVisuilzer_Backend.SQL;
using TickVisualizer_Backend.Models;
using TickVisuilzer_Backend.Models;

namespace TickVisuilzer_Backend.Service
{
    public class TickService
    {
        private readonly TickSQL _tickSQL;
        private List<string> LocationNames = new List<string>();
        public TickService(TickSQL tickSQL)
        {
            _tickSQL = tickSQL;
        }

        public string CleanLocationNames(string name, List<string> cleanNames)
        {
            if (name == null || name == "null") return "";

            var process = Process.ExtractOne(name, cleanNames);

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

            var process = Process.ExtractOne(latin, latinNames);    

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

        public IEnumerable<TickSighting> GetTickSightings()
        {
            var sightings = _tickSQL.GetTickSightings();
            var frequencies = GetLocationNameFrequencies().ToList();
            var mapping = GetTickLatinMapping()
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
            var misspelt = frequencies
                .Where(f => f.Frequency <= cutoff)
                .Select(f => f.Name)
                .ToList();

            foreach (var sighting in sightings)
            {
                if (misspelt.Contains(sighting.LocationName))
                {
                    sighting.LocationName = CleanLocationNames(sighting.LocationName, cleanNames);
                }

                if (sighting.Species.Contains("/"))
                {
                    sighting.Species = CleanSecondSpeciesName(sighting.Species);
                }

                sighting.Latin = CleanTickName(sighting.Latin, mapping);
            }

            return sightings;
        }

        public IEnumerable<LocationNameFrequencies> GetLocationNameFrequencies()
        {
            var frequencies = _tickSQL.GetLocationNameFrequencies();

            return frequencies;
        }

        public IEnumerable<TickLatinMapping> GetTickLatinMapping()
        {
            var mapping = _tickSQL.GetTickMapping();
            return mapping;
        }
    }
}
