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
        public DbSet<ExpenseCategory> ExpenseCategories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            // Many to many for ExpenseCategory
            modelBuilder.Entity<ExpenseCategory>()
                .HasKey(ec => new {ec.ExpenseId , ec.CategoryId});
            modelBuilder.Entity<ExpenseCategory>()
                .HasOne(ec => ec.Expense)
                .WithMany(e => e.ExpenseCategories)
                .HasForeignKey(ec => ec.ExpenseId);
            modelBuilder.Entity<ExpenseCategory>()
                .HasOne(ec => ec.Category)
                .WithMany(c => c.ExpenseCategories)
                .HasForeignKey(ec => ec.CategoryId);
        }
    }
}