using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;


namespace moneyManager.Services
{
    public class CategoriesService : IService<ICategoyDto>
    {
        private readonly DatabaseContext context;

        public CategoriesService(DatabaseContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<ICategoyDto>> GetAllAsync()
        {
            var categories = await Task.FromResult(this.context.Categories.ToList<Category>());
            if (categories is null)
            {
                throw new NotFoundException("Categories not found");
            }
            
            return categories.Select(category => category.AsDto());
        }

        public async Task<ICategoyDto> GetByIdAsync(Guid id)
        {
            var category = await context.Categories.FindAsync(id);
            if (category is null)
            {
                throw new NotFoundException("Category not found.");
            }

            await this.context.Entry(category)
                .Reference(c => c.User)
                .LoadAsync();

            await this.context.Entry(category)
                .Collection(c => c.ExpenseCategories)
                .LoadAsync();

            return category.AsGetByIdDto();
        }

        public async Task<ICategoyDto> AddAsync(ICategoyDto entity)
        {
            var category = (CreateCategoryDto) entity;
            var user = await this.context.Users.FindAsync(category.UserId);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var actualCategory = new Category() {
                Id = Guid.NewGuid(),
                Name = category.Name,
                Description = category.Description,
                DateCreated = DateTime.Now,
                UserId = category.UserId
            };

            this.context.Categories.Add(actualCategory);
            await this.context.SaveChangesAsync();

            return actualCategory.AsGetByIdDto();
        }

        public async Task UpdateAsync(Guid id, ICategoyDto entity)
        {
            var category = (UpdateCategoryDto) entity;
            var existingCategory = await this.context.Categories.FindAsync(id);
            if (existingCategory is null)
            {
                throw new NotFoundException("Category not found.");
            }

            existingCategory.Name = category.Name is null ?
                existingCategory.Name : category.Name;
            existingCategory.Description = category.Description is null ?
                existingCategory.Description : category.Description;

            await this.context.SaveChangesAsync();
            // NOTE:  might have concurency problems
        }
        
        public async Task DeleteAsync(Guid id)
        {
            var exisitingCategory = await this.context.Categories.FindAsync(id);
            if (exisitingCategory == null)
            {
                throw new NotFoundException("Category not found.");
            }
            
            this.context.Categories.Remove(exisitingCategory); 
            await this.context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ICategoyDto>> GetCategoriesOrderedByTotalExpenseAmountAsync()
        {
            var categories = await Task.FromResult(this.context.Categories.ToList<Category>());
            if (categories is null)
            {
                throw new NotFoundException("Category not found.");
            }

            var categoryTotalDtos = new List<CategoryTotalDto>();
            foreach (var category in categories)
            {
                await this.context.Entry(category)
                    .Collection(c => c.ExpenseCategories)
                    .LoadAsync();

                int total = 0;
                foreach (var expenseCategory in category.ExpenseCategories)
                {
                    await this.context.Entry(expenseCategory)
                        .Reference(ec => ec.Expense)
                            .LoadAsync();
                    
                    total += expenseCategory.Expense!.Amount;
                }

                categoryTotalDtos.Add(
                    new CategoryTotalDto
                    {
                        Id = category.Id,
                        Name = category.Name,
                        Description = category.Description,
                        Total = total,
                        UserId = category.UserId
                    });
            }
            categoryTotalDtos = categoryTotalDtos.OrderBy(c => c.Total).ToList();
            
            return categoryTotalDtos;
        }
    }
}