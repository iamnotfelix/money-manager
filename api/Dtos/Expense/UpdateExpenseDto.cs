namespace moneyManager.Dtos
{
    public record UpdateExpenseDto : IExpenseDto
    {
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public DateOnly Date { get; set; }
        public ICollection<ExpenseCategoryDto> ExpenseCategories { get; set; } = new List<ExpenseCategoryDto>();
    }
}