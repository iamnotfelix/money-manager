using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateIncomeDto : IIncomeDto
    {   
        [Required]
        public string? Name { get; set; }
        [Required]
        public double Amount { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public string? Comments { get; set; }
        [Required]
        public Guid UserId { get; set; }
    }
}