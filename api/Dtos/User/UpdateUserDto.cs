namespace moneyManager.Dtos
{
    public record UpdateUserDto : IUserDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Roles { get; set; }
    }
}