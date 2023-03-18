using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    public record Category
    {
        public Guid Id { get; init; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime DateCreated { get; set; }

        // Navigation properties
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public ICollection<ExpenseCategory> ExpenseCategories { get; set; } = new List<ExpenseCategory>();
    }
}