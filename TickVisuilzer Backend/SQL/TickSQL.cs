using Dapper;
using Microsoft.Data.Sqlite;
using TickVisualizer_Backend.Models;
using TickVisuilzer_Backend.Models;

namespace TickVisuilzer_Backend.SQL
{
    public class TickSQL
    {
        private readonly string _connectionString;

        public TickSQL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IEnumerable<TickSighting> GetTickSightings()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = connection.Query<TickSighting>(@"
                SELECT 
                    TL.SOURCE_ID as SourceId,
                    TL.DATE as Date,
                    L.NAME as LocationName,
                    L.LAT as Lat,
                    L.LONG as Long,
                    TS.SPECIES as Species,
                    TS.LATIN as Latin,
                    TS.BIO_CHARACTERISTIC as BioCharacteristic,
                    TS.TYPICAL_HABITAT as TypicalHabitat,
                    TS.HEALTH_RISKS as HealthRisks
                FROM TICK_LOCATION TL
                JOIN TICKS T ON TL.TICK_ID = T.TICK_ID
                JOIN TICK_SPECIES TS ON T.SPECIES_ID = TS.SPECIES_ID
                JOIN LOCATION L ON TL.LOCATION_ID = L.LOCATION_ID");
            return results;
        }

        public IEnumerable<Location> GetLocation()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = connection.Query<Location>(@"
                SELECT 
                    LOCATION_ID as Id,
                    NAME as Name,
                    LAT as Lat,
                    LONG as Long
                FROM LOCATION
            ");
            return results;
        }

        public IEnumerable<TickSpecies> GetTickSpecies()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = connection.Query<TickSpecies>(@"
                SELECT 
                    SPECIES_ID as Id,
                    SPECIES as TickName,
                    LATIN as LatinName,
                    BIO_CHARACTERISTIC as BioCharacteristics,
                    TYPICAL_HABITAT as TypicalHabitat,
                    HEALTH_RISKS as HealthRisks
                FROM TICK_SPECIES
            ");
            return results;
        }

        public IEnumerable<LocationNameFrequencies> GetLocationNameFrequencies()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = connection.Query<LocationNameFrequencies>(@"
                SELECT L.NAME, COUNT(*) as Frequency
                FROM TICK_LOCATION TL
                JOIN LOCATION L ON TL.LOCATION_ID = L.LOCATION_ID
                GROUP BY L.NAME
                ORDER BY Frequency DESC
            ");
            return results;
        }

        public IEnumerable<TickLatinMapping> GetTickMapping()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = connection.Query<TickLatinMapping>(@"
                SELECT 
                    TICK_NAME as TickName,
                    TICK_LATIN_NAME as LatinName
                FROM TICK_LATIN_MAPPING
            ");
            return results;
        }
    }
}
