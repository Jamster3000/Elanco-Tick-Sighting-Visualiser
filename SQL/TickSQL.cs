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

        public async Task<IEnumerable<TickSighting>> GetTickSightings()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<TickSighting>(@"
                SELECT 
                    TL.SOURCE_ID as SourceId,
                    TL.DATE as Date,
                    L.NAME as LocationName,
                    TS.SPECIES as Species,
                    TS.LATIN as Latin
                FROM TICK_LOCATION TL
                JOIN TICKS T ON TL.TICK_ID = T.TICK_ID
                JOIN TICK_SPECIES TS ON T.SPECIES_ID = TS.SPECIES_ID
                JOIN LOCATION L ON TL.LOCATION_ID = L.LOCATION_ID");
            return results;
        }

        public async Task<IEnumerable<Location>> GetLocation()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<Location>(@"
                SELECT 
                    LOCATION_ID as Id,
                    NAME as Name
                FROM LOCATION
            ");
            return results;
        }

        public async Task<IEnumerable<TickSpecies>> GetTickSpecies()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<TickSpecies>(@"
                SELECT 
                    TS.SPECIES_ID as Id,
                    TS.SPECIES as TickName,
                    TS.LATIN as LatinName,
                    TSI.BIO_CHARACTERISTIC as BioCharacteristics,
                    TSI.TYPICAL_HABITAT as TypicalHabitat,
                    TSI.HEALTH_RISKS as HealthRisks,
                    TS.IMAGE as Image
                FROM TICK_SPECIES TS
                JOIN TICK_SPECIES_INFO TSI ON TS.SPECIES_ID = TSI.SPECIES_ID
            ");
            return results;
        }

        public async Task<IEnumerable<LocationNameFrequencies>> GetLocationNameFrequencies()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<LocationNameFrequencies>(@"
                SELECT L.NAME, COUNT(*) as Frequency
                FROM TICK_LOCATION TL
                JOIN LOCATION L ON TL.LOCATION_ID = L.LOCATION_ID
                GROUP BY L.NAME
                ORDER BY Frequency DESC
            ");
            return results;
        }

        public async Task<IEnumerable<TickLatinMapping>> GetTickMapping()
        {
            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<TickLatinMapping>(@"
                SELECT 
                    TICK_NAME as TickName,
                    TICK_LATIN_NAME as LatinName
                FROM TICK_LATIN_MAPPING
            ");
            return results;
        }
    }
}
