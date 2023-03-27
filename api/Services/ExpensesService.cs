using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;

namespace moneyManager.Services
{
    public class ExpensesService : IService<IExpenseDto>
    {
        private readonly DatabaseContext context;

        public ExpensesService(DatabaseContext context)
        {
            this.context = context;
        }
        
        public async Task<IEnumerable<IExpenseDto>> GetAllAsync()
        {
            var expenses = await Task.FromResult(this.context.Expenses.ToList<Expense>());
            if (expenses is null)
            {
                throw new NotFoundException("Expenses not found.");
            }
            
            return expenses.Select(expense => expense.AsDto());
        }

        public async Task<IExpenseDto> GetByIdAsync(Guid id)
        {
            var expense = await context.Expenses.FindAsync(id);
            if (expense is null)
            {
                throw new NotFoundException("Expense not found.");
            }

            await this.context.Entry(expense)
                .Reference(e => e.User)
                .LoadAsync();

            await this.context.Entry(expense)
                .Collection(e => e.ExpenseCategories)
                .LoadAsync();
            
            foreach (var expenseCategory in expense.ExpenseCategories)
            {
                await this.context.Entry(expenseCategory)
                    .Reference(ec => ec.Category)
                    .LoadAsync();
            }

            return expense.AsGetByIdDto();
        }

        public async Task<IExpenseDto> AddAsync(IExpenseDto entity)
        {
            CreateExpenseDto expense = (CreateExpenseDto) entity;
            var user = await this.context.Users.FindAsync(expense.UserId);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var actualExpense = new Expense() 
            {
                Id = Guid.NewGuid(),
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                Date = expense.Date,
                DateCreated = DateTime.Now,
                UserId = expense.UserId
            };

            actualExpense.Validate();

            this.context.Expenses.Add(actualExpense);
            await this.context.SaveChangesAsync();

            foreach (var expenseCategory in expense.ExpenseCategories)
            {
                var category = await this.context.Categories.FindAsync(expenseCategory.CategoryId);
                if (category is null)
                {
                    throw new NotFoundException("Category not found.");
                }

                var actualExpenseCategory = new ExpenseCategory
                {
                    Notes = expenseCategory.Notes,
                    DateCreated = DateTime.Now,
                    ExpenseId = actualExpense.Id,
                    CategoryId = expenseCategory.CategoryId
                };

                this.context.ExpenseCategories.Add(actualExpenseCategory);
                await this.context.SaveChangesAsync();
            }

            return actualExpense.AsGetByIdDto();
        }

        public async Task UpdateAsync(Guid id, IExpenseDto entity)
        {
            UpdateExpenseDto expense = (UpdateExpenseDto) entity;
            var existingExpense = await this.context.Expenses.FindAsync(id);
            if (existingExpense is null)
            {
                throw new NotFoundException("Expense not found.");
            }

            var validationExpense = new Expense {
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                Date = expense.Date
            };

            validationExpense.Validate();

            existingExpense.Amount = expense.Amount is 0 ? 
                existingExpense.Amount : expense.Amount;
            existingExpense.PaymentType = expense.PaymentType is null ? 
                existingExpense.PaymentType : expense.PaymentType;
            existingExpense.Description = expense.Description is null ?
                existingExpense.Description : expense.Description;
            existingExpense.Currency = expense.Currency is null ?
                existingExpense.Currency : expense.Currency;
            existingExpense.Date = expense.Date == DateTime.MinValue ?
                existingExpense.Date : expense.Date;

            await this.context.SaveChangesAsync();
            
            // NOTE:  might have concurency problems

            if (expense.ExpenseCategories.Count > 0)
            {
                // Delete existing category relations
                var toDeleteExpenseCategories = this.context.ExpenseCategories.Where(ec => ec.ExpenseId == existingExpense.Id);
                foreach (var expenseCategory in toDeleteExpenseCategories)
                {
                    this.context.ExpenseCategories.Remove(expenseCategory);
                }
                await this.context.SaveChangesAsync();

                // Add new category relations
                foreach (var expenseCategory in expense.ExpenseCategories)
                {
                    var category = await this.context.Categories.FindAsync(expenseCategory.CategoryId);
                    if (category is null)
                    {
                        throw new NotFoundException("Category not found.");
                    }

                    var newExpenseCategory = new ExpenseCategory
                    {
                        Notes = expenseCategory.Notes,
                        DateCreated = DateTime.Now,
                        ExpenseId = existingExpense.Id,
                        CategoryId = expenseCategory.CategoryId
                    };

                    this.context.ExpenseCategories.Add(newExpenseCategory);
                    await this.context.SaveChangesAsync();
                }
            }
        }
        
        public async Task DeleteAsync(Guid id)
        {
            var exisitingExpense = await this.context.Expenses.FindAsync(id);
            if (exisitingExpense is null)
            {
                throw new NotFoundException("Expense not found.");
            }
            
            this.context.Expenses.Remove(exisitingExpense);
            await this.context.SaveChangesAsync();
        }

        public async Task<IEnumerable<IExpenseDto>> GetExpensesHigherThan(int nr)
        {
            var expenses = await Task.FromResult(this.context.Expenses.Where(expense => expense.Amount > nr));
            return expenses.Select(expense => expense.AsDto());   
        }
    }
}