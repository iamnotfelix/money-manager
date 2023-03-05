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
        private readonly IExpensesRepository repository;

        public ExpensesController(IExpensesRepository repository) 
        {
            this.repository = repository;
        }


        // GET /expenses
        [HttpGet]
        public IEnumerable<Expense> GetExpenses() 
        {
            var expenses = repository.getExpenses();

            return expenses;
        }


        // GET /expenses/{id}
        [HttpGet("{id}")]
        public ActionResult<Expense> GetExpense(Guid id)
        {
            var expense = repository.getExpense(id);

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
                Description = expense.Description,
                Time = expense.Time
            };

            this.repository.createExpense(actualExpense);

            return CreatedAtAction(nameof(GetExpense), new { id = actualExpense.Id }, expense);
        }
    }
}