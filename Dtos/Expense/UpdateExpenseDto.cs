namespace moneyManager.Dtos
{
    public record UpdateExpenseDto : IExpenseDto
    {
        public int Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public DateTime Date { get; set; }
        public ICollection<ExpenseCategoryDto> ExpenseCategories { get; set; } = new List<ExpenseCategoryDto>();
    }
}