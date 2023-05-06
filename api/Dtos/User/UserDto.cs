namespace moneyManager.Dtos
{
    public record UserDto : IUserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
    }
}