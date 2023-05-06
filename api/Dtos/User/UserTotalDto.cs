namespace moneyManager.Dtos
{
    public record UserTotalDto : IUserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public double TotalSpent { get; set; }
    }
}