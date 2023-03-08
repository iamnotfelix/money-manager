using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using System.Threading.Tasks;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpensesContext context;

        public ExpensesController(ExpensesContext context) 
        {
            this.context = context;
        }


        // GET /expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpensesAsync() 
        { 
            if (this.context.Expense == null) 
            {
                return NotFound();
            }

            return await Task.FromResult(this.context.Expense.ToList<Expense>());
        }


        // GET /expenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Expense>> GetExpenseAsync(Guid id)
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

            return expense;
        }

        // POST /expense
        [HttpPost]
        public async Task<ActionResult<Expense>> CreateExpenseAsync(CreateExpenseDto expense) 
        {
            var actualExpense = new Expense() {
                Id = Guid.NewGuid(),
                Amount = expense.Amount,
                Category = expense.Category,
                PaymentType = expense.PaymentType,
                Currency = expense.Currency,
                Date = expense.Date,
                Description = expense.Description
            };

            this.context.Expense.Add(actualExpense);
            await this.context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExpenseAsync), new { id = actualExpense.Id }, actualExpense);
        }

        // PUT /expense/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateItemAsync(Guid id, UpdateExpenseDto expense) 
        {
            var existingExpense = await this.context.Expense.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound();
            }

            existingExpense.Amount = expense.Amount;
            existingExpense.Category = expense.Category;
            existingExpense.PaymentType = expense.PaymentType;
            existingExpense.Currency = expense.Currency;
            existingExpense.Date = expense.Date;
            existingExpense.Description = expense.Description;

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