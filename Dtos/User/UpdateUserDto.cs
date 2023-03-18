namespace moneyManager.Dtos
{
    public record UpdateUserDto
    {
        public string? Name { get; set; }
        public string? Password { get; set; }
    }
}