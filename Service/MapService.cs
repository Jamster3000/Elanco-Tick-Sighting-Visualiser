using System.Globalization;
using System.Text.Json;
using CsvHelper;
using CsvHelper.Configuration;
using ElantroProj.Models;

namespace ElantroProj.Service
{
    public class MapService
    {
        private Dictionary<string, MapPostcode> _postcodeIndex = new();
        private Dictionary<string, List<MapLocation>> _locationIndex = new();
        private GeoJsonFeatureCollection _boundaries = new();

        public async Task LoadDataAsync(string postcodesPath, string locationsPath, string boundariesPath)
        {
            try
            {
                var postcodeTask = LoadPostcodesAsync(postcodesPath);
                var locationTask = LoadLocationsAsync(locationsPath);
                var boundariesTask = LoadBoundariesAsync(boundariesPath);
                await Task.WhenAll(postcodeTask, locationTask, boundariesTask);

                var postcodes = await postcodeTask;
                var locations = await locationTask;

                _postcodeIndex = postcodes.ToDictionary(p => p.Postcode, p => p);

                _locationIndex = locations
                    .GroupBy(l => l.Name ?? "")
                    .ToDictionary(g => g.Key, g => g.ToList());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private async Task<List<MapPostcode>> LoadPostcodesAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Postcode file not found: {filePath}");

            var result = new List<MapPostcode>();
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            csv.Context.RegisterClassMap<MapPostcodeMap>();

            await foreach (var record in csv.GetRecordsAsync<MapPostcode>())
            {
                result.Add(record);
            }
            return result;
        }

        private async Task<List<MapLocation>> LoadLocationsAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Location file not found: {filePath}");

            var result = new List<MapLocation>();
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            csv.Context.RegisterClassMap<MapLocationMap>();

            await foreach (var record in csv.GetRecordsAsync<MapLocation>())
            {
                result.Add(record);
            }
            return result;
        }

        private async Task LoadBoundariesAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Boundaries file not found: {filePath}");

            var json = await File.ReadAllTextAsync(filePath);
            var items = JsonSerializer.Deserialize<List<BoundaryItem>>(json) ?? new();

            _boundaries = new GeoJsonFeatureCollection
            {
                Features = items.Select(item => new GeoJsonFeature
                {
                    Properties = new Dictionary<string, object?>
            {
                { "name", item.Name },
                { "original_name", item.OriginalName }
            },
                    Geometry = item.Polygon
                }).ToList()
            };
        }

        public MapPostcode? GetPostcode(string postcode)
            => _postcodeIndex.TryGetValue(postcode, out var pc) ? pc : null;

        public MapLocation? GetLocation(string name)
            => _locationIndex.TryGetValue(name ?? "", out var locs) ? locs.FirstOrDefault() : null;

        public IEnumerable<MapLocation> GetAllLocationsWithName(string name)
            => _locationIndex.TryGetValue(name ?? "", out var locs) ? locs : Enumerable.Empty<MapLocation>();

        public IEnumerable<MapLocation> GetAllLocations()
            => _locationIndex.Values.SelectMany(l => l);

        public GeoJsonFeatureCollection GetBoundaries() => _boundaries;

        public GeoJsonFeature? GetBoundaryByName(string name)
        {
            return _boundaries.Features.FirstOrDefault(f =>
                f.Properties.ContainsKey("name") &&
                f.Properties["name"]?.ToString() == name);
        }
    }

    public class MapPostcodeMap : ClassMap<MapPostcode>
    {
        public MapPostcodeMap()
        {
            Map(m => m.Postcode).Name("postcode");
            Map(m => m.PostcodeLatitude).Name("plat");
            Map(m => m.PostcodeLongitude).Name("plng");
        }
    }

    public class MapLocationMap : ClassMap<MapLocation>
    {
        public MapLocationMap()
        {
            Map(m => m.Name).Name("name");
            Map(m => m.LocationType).Name("local_type");
            Map(m => m.cityLatitude).Name("lat");
            Map(m => m.cityLongitude).Name("lng");
        }
    }
}