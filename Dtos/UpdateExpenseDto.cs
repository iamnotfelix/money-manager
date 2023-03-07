using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record UpdateExpenseDto
    {
        [Required]
        [Range(0, 10000)]
        public int Amount { get; set; }
        [Required]
        public string? Category { get; set; }
        [Required]
        public string? PaymentType { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public DateTime Date { get; set; }
        public string? Description { get; set; }
    }
}