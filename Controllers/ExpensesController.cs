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
        private readonly ExpensesContext context;

        public ExpensesController(ExpensesContext context) 
        {
            this.context = context;
        }


        // GET /expenses
        [HttpGet]
        public ActionResult<IEnumerable<Expense>> GetExpenses() 
        { 
            if (this.context.Expense == null) 
            {
                return NotFound();
            }

            return this.context.Expense.ToList<Expense>();
        }


        // GET /expenses/{id}
        [HttpGet("{id}")]
        public ActionResult<Expense> GetExpense(Guid id)
        {
            if (this.context.Expense is null) 
            {
                return NotFound();
            }

            var expense = context.Expense.Find(id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
        }

        // POST /expense
        [HttpPost]
        public ActionResult<Expense> CreateExpense(CreateExpenseDto expense) 
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
            this.context.SaveChanges();

            return CreatedAtAction(nameof(GetExpense), new { id = actualExpense.Id }, actualExpense);
        }

        // PUT /expense/{id}
        [HttpPut("{id}")]
        public ActionResult UpdateItem(Guid id, UpdateExpenseDto expense) 
        {
            var existingExpense = this.context.Expense.Find(id);
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

            this.context.SaveChanges();
            
            // NOTE: id multithreading is added, I need to keep track of concurency

            return NoContent();
        }

        // DELETE /expenses/{id}
        [HttpDelete("{id}")]
        public ActionResult DeleteExpense(Guid id)
        {
            var exisitingExpense = this.context.Expense.Find(id);
            if (exisitingExpense == null)
            {
                return NotFound();
            }
            
            this.context.Expense.Remove(exisitingExpense); 
            this.context.SaveChanges();

            return NoContent();
        }
    }
}