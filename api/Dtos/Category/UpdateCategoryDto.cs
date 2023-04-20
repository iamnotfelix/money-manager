namespace moneyManager.Dtos
{
    public record UpdateCategoryDto : ICategoryDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}