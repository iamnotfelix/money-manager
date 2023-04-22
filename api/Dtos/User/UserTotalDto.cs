namespace moneyManager.Dtos
{
    public record UserTotalDto : IUserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Name { get; set; }
        public long TotalSpent { get; set; }
    }
}