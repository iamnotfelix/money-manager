namespace moneyManager.Dtos
{
    public record UpdateCategoryDto : ICategoyDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}