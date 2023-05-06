using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    [Table("incomes")]
    public record Income
    {
        public Guid Id { get; init; }
        public string? Name { get; set; }
        public double Amount { get; set; }
        public string? Currency { get; set; }
        public string? Comments { get; set; }
        public DateTime DateCreated { get; set; }

        // Navigation properties
        public Guid UserId { get; set; }
        public User? User { get; set; }
    }
}