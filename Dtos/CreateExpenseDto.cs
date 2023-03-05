using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateExpenseDto
    {
        [Required]
        [Range(0, 10000)]
        public int Amount { get; set; }
        [Required]
        public string? Category { get; set; }
        [Required]
        public string? PaymentType { get; set; }
        public string?  Description { get; set; }
        [Required]
        public DateTime Time { get; set; }
    }
}