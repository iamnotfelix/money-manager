using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    [Table("users")]
    public record User
    {
        public Guid Id { get; init; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Roles { get; set; }
        public DateTime DateCreated { get; set; }

        // Activation properties
        public string? ActivationToken { get; set; }
        public DateTime Expires { get; set; }
        public bool Active { get; set; }

        // Navigation propreties
        public UserProfile? UserProfile { get; set; }
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public ICollection<Income> Incomes { get; set; } = new List<Income>();
    }
}