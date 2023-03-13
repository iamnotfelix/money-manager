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
                UserId = category.User!.Id
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
    }
}