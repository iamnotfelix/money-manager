using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record UpdateIncomeDto : IIncomeDto
    {   
        public string? Name { get; set; }
        public double Amount { get; set; }
        public string? Currency { get; set; }
        public string? Comments { get; set; }
    }
}