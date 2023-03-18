using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly DatabaseContext context;

        public ExpensesController(DatabaseContext context) 
        {
            this.context = context;
        }


        // GET /expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpensesAsync() 
        { 
            var expenses = await Task.FromResult(this.context.Expense.ToList<Expense>());
            if (expenses == null)
            {
                return NotFound();
            }
            
            return Ok(expenses.Select(expense => expense.AsDto()));
        }

        // GET /expenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdExpenseDto>> GetExpenseAsync(Guid id)
        {
            if (this.context.Expense is null) 
            {
                return NotFound();
            }

            var expense = await context.Expense.FindAsync(id);

            if (expense == null)
            {
                return NotFound();
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

        // GET /expenses/filter/{nr}
        [HttpGet("filter/{nr}")]
        public async Task<ActionResult<ExpenseDto>> GetExpensesHigherThan(int nr)
        {
            if (this.context.Expense is null)
            {
                return NotFound();
            }

            var expenses = await Task.FromResult(this.context.Expense.Where(expense => expense.Amount > nr));
            return Ok(expenses.Select(expense => expense.AsDto()));
        }

        // POST /expenses
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpenseAsync(CreateExpenseDto expense) 
        {
            var user = await this.context.Users.FindAsync(expense.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
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

            this.context.Expense.Add(actualExpense);
            await this.context.SaveChangesAsync();

            foreach (var expenseCategory in expense.ExpenseCategories)
            {
                var category = await this.context.Categories.FindAsync(expenseCategory.CategoryId);
                if (category is null)
                {
                    return NotFound("Category not found.");
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

            return CreatedAtAction(nameof(GetExpenseAsync), new { id = actualExpense.Id }, actualExpense.AsDto());
        }

        // PUT /expenses/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateExpenseAsync(Guid id, UpdateExpenseDto expense) 
        {
            var existingExpense = await this.context.Expense.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound();
            }

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
                        return NotFound("Category not found.");
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

            return NoContent();
        }

        // DELETE /expenses/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpenseAsync(Guid id)
        {
            var exisitingExpense = await this.context.Expense.FindAsync(id);
            if (exisitingExpense == null)
            {
                return NotFound();
            }
            
            this.context.Expense.Remove(exisitingExpense);
            await this.context.SaveChangesAsync();

            return NoContent();
        }
    }
}