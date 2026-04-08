using System.Collections;
using Dapper;
using Microsoft.Data.Sqlite;
using TickVisualizer_Backend.Models;
using TickVisuilzer_Backend.Models;

namespace TickVisualizer_Backend.Models
{
    public class AuthSQL
    {
        private readonly string _connectionString;

        public AuthSQL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<UserAccount> GetUserByEmail(string email)
        {
            using var connection = new SqliteConnection(_connectionString);
            var result = await connection.QueryFirstOrDefaultAsync<UserAccount>(@"
                SELECT 
                    AUTH_ID as Id,
                    EMAIL as Email,
                    PASSWORD as PasswordHash,
                    USERNAME as FullName
                FROM AUTHENTICATION
                WHERE EMAIL = @Email
            ", new { Email = email });

            return result;
        }

        public async Task<int> CreateUserAccount(UserAccount user)
        {
            using var connection = new SqliteConnection(_connectionString);
            var result = await connection.ExecuteScalarAsync<int>(@"
                INSERT INTO AUTHENTICATION (EMAIL, PASSWORD, USERNAME)
                VALUES (@Email, @PasswordHash, @FullName);
                SELECT last_insert_rowid();
            ", new
            {
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                FullName = user.FullName
            });

            return result;
        }

        public async Task<UserAccount> GetUserByEmailAndPassword(string email, string plainTextPassword)
        {
            var user = await GetUserByEmail(email);
            if (user == null) { return null; }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(plainTextPassword, user.PasswordHash);
            return isPasswordValid ? user : null;
        }

        public async Task<UserAccount> GetUserById(int id)
        {
            using var connection = new SqliteConnection(_connectionString);
            var result = await connection.QueryFirstOrDefaultAsync<UserAccount>(@"
                SELECT 
                    AUTH_ID as Id,
                    EMAIL as Email,
                    PASSWORD as PasswordHash,
                    USERNAME as FullName
                FROM AUTHENTICATION
                WHERE AUTH_ID = @Id
            ", new { Id = id });

            return result;
        }

        public async Task<UserAccount> UpdateUserEmail(int id, string newEmail)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.ExecuteAsync(@"
                UPDATE AUTHENTICATION
                SET EMAIL = @NewEmail
                WHERE AUTH_ID = @Id
            ", new { NewEmail = newEmail, Id = id });
            return await GetUserById(id);
        }

        public async Task<UserAccount> DeleteUserAccount(int id)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.ExecuteAsync(@"
                DELETE FROM AUTHENTICATION
                WHERE AUTH_ID = @Id
            ", new { Id = id });
            return null;
        }
    }
}
