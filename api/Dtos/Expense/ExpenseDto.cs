namespace moneyManager.Dtos
{
    public record ExpenseDto : IExpenseDto
    {
        public Guid Id { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public Guid UserId { get; set; }
        public DateOnly Date { get; set; }
    }
}