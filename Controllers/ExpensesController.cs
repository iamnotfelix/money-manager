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
        public async Task<ActionResult<ExpenseDto>> GetExpenseAsync(Guid id)
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

            return expense.AsDto();
        }

        // POST /expense
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpenseAsync(CreateExpenseDto expense) 
        {
            var user = await this.context.Users.FindAsync(expense.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var actualExpense = new Expense() {
                Id = Guid.NewGuid(),
                Amount = expense.Amount,
                PaymentType = expense.PaymentType,
                Description = expense.Description,
                Currency = expense.Currency,
                UserId = expense.UserId,
                Date = expense.Date,
                DateCreated = DateTime.Now
            };

            this.context.Expense.Add(actualExpense);
            await this.context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpenseAsync), new { id = actualExpense.Id }, actualExpense.AsDto());
        }

        // PUT /expense/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateExpenseAsync(Guid id, UpdateExpenseDto expense) 
        {
            var existingExpense = await this.context.Expense.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound();
            }

            existingExpense.Amount = expense.Amount;
            existingExpense.PaymentType = expense.PaymentType;
            existingExpense.Description = expense.Description;
            existingExpense.Currency = expense.Currency;
            existingExpense.Date = expense.Date;

            await this.context.SaveChangesAsync();
            
            // NOTE:  might have concurency problems

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