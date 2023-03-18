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
                Name = user.Name
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
                Name = user.Name,
                Expenses = user.Expenses.Select(e => e.AsDto()).ToList()
            };
        }
    }
}