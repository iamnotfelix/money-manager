namespace moneyManager.Dtos
{
    public record UpdateUserDto : IUserDto
    {
        public string? Name { get; set; }
        public string? Password { get; set; }
    }
}