using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;

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

        [HttpGet]
        public IEnumerable<Expense> GetExpenses() 
        {
            var expenses = repository.getExpenses();

            return expenses;
        }

        [HttpGet("{id}")]
        public ActionResult<Expense> GetExpense(Guid id)
        {
            var expense = repository.getExpense(id);

            if (expense == null)
            {
                return NotFound();
            }

            return expense;
            /*if (expenses == null) 
            {
                return NotFound();
            }*/
        }
    }
}