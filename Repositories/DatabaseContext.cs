using Microsoft.EntityFrameworkCore;
using moneyManager.Models;
using MySql.EntityFrameworkCore.Extensions;

namespace moneyManager.Repositories
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<Expense> Expense { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;

        // protected override void OnModelCreating(ModelBuilder modelBuilder) 
        // {
        //     // change table attributes properties
        // }
    }
}