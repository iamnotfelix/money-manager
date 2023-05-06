using moneyManager.Dtos;
using moneyManager.Models;

namespace moneyManager
{
    public static class Extension
    {
        public static ExpenseDto AsDto(this Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                UserId = expense.UserId,
                Date = expense.Date
            };
        }


        public static CategoryDto AsDto(this Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                UserId = category.UserId
            };
        }
        
        public static UserDto AsDto(this User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            };
        }

        public static UserProfileDto AsDto(this UserProfile userProfile)
        {
            return new UserProfileDto
            {
                Id = userProfile.Id,
                Name = userProfile.Name,
                Status = userProfile.Status,
                Bio = userProfile.Bio,
                Gender = userProfile.Gender,
                Birthday = userProfile.Birthday
            };
        }

        public static IncomeDto AsDto(this Income income) 
        {
            return new IncomeDto
            {
                Id = income.Id,
                Name = income.Name,
                Amount = income.Amount,
                Currency = income.Currency,
                Comments = income.Comments,
                UserId = income.UserId
            };  
        }

        public static GetByIdExpenseDto AsGetByIdDto(this Expense expense)
        {
            return new GetByIdExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                User = expense.User!.AsDto(),
                Date = expense.Date,
                Categories = expense.ExpenseCategories.Select(e => e.Category!.AsDto()).ToList()
            };
        }

        public static GetByIdCategoryDto AsGetByIdDto(this Category category)
        {
            return new GetByIdCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                User = category.User!.AsDto(),
                Expenses = category.ExpenseCategories.Select(ec => ec.Expense!.AsDto()).ToList()
            };
        }

        public static GetByIdUserDto AsGetByIdDto(this User user)
        {
            return new GetByIdUserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                UserProfile = (user.UserProfile is not null ? user.UserProfile.AsDto() : null),
                Expenses = (user.Expenses is not null ? user.Expenses.Select(e => e.AsDto()).ToList() : new List<ExpenseDto>()),
                Categories = (user.Categories is not null ? user.Categories.Select(e => e.AsDto()).ToList() : new List<CategoryDto>())
            };
        }

        public static GetByIdIncomeDto AsGetByIdDto(this Income income) 
        {
            return new GetByIdIncomeDto
            {
                Id = income.Id,
                Name = income.Name,
                Amount = income.Amount,
                Currency = income.Currency,
                Comments = income.Comments,
                User = (income.User is not null ? income.User.AsDto() : null)
            };  
        }

        public static ExpenseTotalDto AsTotalDto(this Expense expense)
        {
            return new ExpenseTotalDto 
            {
                Id = expense.Id,
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                UserId = expense.UserId,
                Date = expense.Date,
                TotalCategories = (expense.ExpenseCategories is not null ? expense.ExpenseCategories.Count() : 0)
            };
        }

        public static CategoryTotalDto AsTotalDto(this Category category)
        {
            return new CategoryTotalDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                UserId = category.UserId,
                Total = (category.ExpenseCategories is not null ? category.ExpenseCategories.Sum(ec => (ec.Expense is not null ? ec.Expense.Amount : 0)) : 0)
            };
        }

        public static UserTotalDto AsTotalDto(this User user)
        {
            return new UserTotalDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                TotalSpent = (user.Expenses is not null ? user.Expenses.Sum(e => e.Amount) : 0)
            };
        }

        public static IncomeTotalDto AsTotalDto(this Income income) 
        {
            return new IncomeTotalDto
            {
                Id = income.Id,
                Name = income.Name,
                Amount = income.Amount,
                Currency = income.Currency,
                Comments = income.Comments,
                UserId = income.UserId,
                TotalExpenses = (income.User is not null ? (income.User.Expenses is not null ? income.User.Expenses.Count() : 0) : 0)
            };  
        }
    }
}