namespace moneyManager.Dtos
{
    public record ExpenseTotalDto : IExpenseDto
    {
        public Guid Id { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public long TotalCategories {get; set; }
    }
}