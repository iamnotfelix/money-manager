using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using Microsoft.EntityFrameworkCore;
using moneyManager.Responses;
using moneyManager.Filters;

namespace moneyManager.Services
{
    public class CategoriesService : IService<ICategoryDto>
    {
        private readonly DatabaseContext context;
        private readonly IUriBuilder uriBuilder;
        private readonly IPermission permission;

        public CategoriesService(DatabaseContext context, IUriBuilder uriBuilder, IPermission permission)
        {
            this.context = context;
            this.uriBuilder = uriBuilder;
            this.permission = permission;
        }

        public async Task<PagedResponse<IEnumerable<ICategoryDto>>> GetAllAsync(PaginationFilter filter, string route)
        {
            var categories = await this.context.Categories
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Categories not found");
            }

            var totalRecords = await this.context.Categories.CountAsync();
            var categoriesDtos = categories.Select(category => category.AsDto());

            return PagedResponse<ICategoryDto>.CreatePagedReponse(categoriesDtos, filter, totalRecords, uriBuilder, route);
        }

        public async Task<ICategoryDto> GetByIdAsync(Guid id)
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

            foreach (var expenseCategory in category.ExpenseCategories)
            {
                await this.context.Entry(expenseCategory)
                    .Reference(ec => ec.Expense)
                    .LoadAsync();
            }

            return category.AsGetByIdDto();
        }

        public async Task<IEnumerable<CategoryDto>> SearchCategoryAsync(SearchFilter filter)
        {
            var categories = await this.context.Categories
                .Where(u => u.Name!.StartsWith(filter.Text, StringComparison.OrdinalIgnoreCase))
                .Take(filter.Number)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Categories not found.");
            }

            return categories.Select(category => category.AsDto());
        }

        public async Task<PagedResponse<IEnumerable<ICategoryDto>>> GetCategoriesTotalAsync(PaginationFilter filter, string route)
        {
            var categories = await this.context.Categories
                .Include(c => c.ExpenseCategories)
                .ThenInclude(ec => ec.Expense)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Categories not found");
            }

            var totalRecords = await this.context.Categories.CountAsync();
            var categoriesDtos = categories.Select(category => category.AsTotalDto());

            return PagedResponse<ICategoryDto>.CreatePagedReponse(categoriesDtos, filter, totalRecords, uriBuilder, route);
        }

        public async Task<PagedResponse<IEnumerable<ICategoryDto>>> GetCategoriesOrderedByTotalExpenseAmountAsync(PaginationFilter filter, string route)
        {
            var categories = await this.context.Categories
                .Include(c => c.ExpenseCategories)
                .ThenInclude(ec => ec.Expense)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Category not found.");
            }

            var totalRecords = await this.context.Categories.CountAsync();
            var categoriesDtos = categories
                .Select(c => c.AsTotalDto())
                .OrderBy(c => c.Total)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize);
            
            return PagedResponse<ICategoryDto>.CreatePagedReponse(categoriesDtos, filter, totalRecords, uriBuilder, route);
        }

        public async Task<ICategoryDto> GetCategoryWithMinTotalExpenseAmountAsync()
        {
            var categories = await this.context.Categories
                .Include(c => c.ExpenseCategories)
                .ThenInclude(ec => ec.Expense)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Category not found.");
            }

            CategoryTotalDto? minimumCategory = null;
            double minimumTotal = Double.MaxValue;
            foreach (var category in categories)
            {
                double total = category.ExpenseCategories.Sum(ec => ec.Expense!.Amount);
                if (minimumTotal > total && total > 0)
                {
                    minimumTotal = total;
                    minimumCategory = new CategoryTotalDto
                    {
                        Id = category.Id,
                        Name = category.Name,
                        Description = category.Description,
                        Total = total,
                        UserId = category.UserId
                    };
                }
            }
            
            if (minimumCategory is null)
            {
                throw new NotFoundException("No category found.");
            }

            return minimumCategory;
        }

        public async Task<ICategoryDto> GetCategoryWithMaxTotalExpenseAmountAsync()
        {
            var categories = await this.context.Categories
                .Include(c => c.ExpenseCategories)
                .ThenInclude(ec => ec.Expense)
                .ToListAsync();

            if (categories is null)
            {
                throw new NotFoundException("Category not found.");
            }

            CategoryTotalDto? maximumCategory = null;
            double maximumTotal = Double.MinValue;
            foreach (var category in categories)
            {
                double total = category.ExpenseCategories.Sum(ec => ec.Expense!.Amount);
                if (maximumTotal < total && total > 0)
                {
                    maximumTotal = total;
                    maximumCategory = new CategoryTotalDto
                    {
                        Id = category.Id,
                        Name = category.Name,
                        Description = category.Description,
                        Total = total,
                        UserId = category.UserId
                    };
                }
            }
            
            if (maximumCategory is null)
            {
                throw new NotFoundException("No category found.");
            }

            return maximumCategory;
        }

        public async Task<ICategoryDto> AddAsync(ICategoryDto entity)
        {
            var category = (CreateCategoryDto) entity;

            this.permission.Check(category.UserId);

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

            actualCategory.Validate();

            this.context.Categories.Add(actualCategory);
            await this.context.SaveChangesAsync();

            return actualCategory.AsGetByIdDto();
        }

        public async Task UpdateAsync(Guid id, ICategoryDto entity)
        {
            var category = (UpdateCategoryDto) entity;

            var existingCategory = await this.context.Categories.FindAsync(id);
            if (existingCategory is null)
            {
                throw new NotFoundException("Category not found.");
            }

            this.permission.Check(existingCategory.UserId);

            var validationCategory = new Category {
                Name = category.Name,
                Description = category.Description
            };

            validationCategory.Validate();

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
            
            this.permission.Check(exisitingCategory.UserId);

            this.context.Categories.Remove(exisitingCategory); 
            await this.context.SaveChangesAsync();
        }
    }
}