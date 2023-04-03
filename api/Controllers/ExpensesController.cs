using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Services;
using moneyManager.Exceptions;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpensesService service;

        public ExpensesController(IService<IExpenseDto> service) 
        {
            this.service = (ExpensesService) service;
        }


        // GET /expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpensesAsync() 
        {
            try
            {
                var expenses = await this.service.GetAllAsync();
                return Ok(expenses);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /expenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdExpenseDto>> GetExpenseAsync(Guid id)
        {
            try
            {
                var expense = await this.service.GetByIdAsync(id);
                return Ok(expense);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /expenses/filter/{nr}
        [HttpGet("filter/{nr}")]
        public async Task<ActionResult<ExpenseDto>> GetExpensesHigherThan(int nr)
        {
            try
            {
                var expenses = await this.service.GetExpensesHigherThan(nr);
                return Ok(expenses);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // POST /expenses
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> CreateExpenseAsync(CreateExpenseDto expense) 
        {
            try
            {
                var newExpense = (GetByIdExpenseDto) await this.service.AddAsync(expense);
                return CreatedAtAction(nameof(GetExpenseAsync), new { id = newExpense.Id }, newExpense);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return ValidationProblem(e.Message);
            }
        }
        
        // POST /expenses/bulk
        [HttpPost("bulk")]
        public async Task<ActionResult> CreateBulkExpensesAsync(ICollection<CreateExpenseDto> expenses) 
        {
            try
            {
                foreach (CreateExpenseDto expense in expenses) 
                {
                    var newExpense = (GetByIdExpenseDto) await this.service.AddAsync(expense);
                }
                return NoContent();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return ValidationProblem(e.Message);
            }
        }

        // PUT /expenses/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateExpenseAsync(Guid id, UpdateExpenseDto expense) 
        {
            try
            {
                await this.service.UpdateAsync(id, expense);
                return NoContent();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return ValidationProblem(e.Message);
            }
        }

        // DELETE /expenses/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExpenseAsync(Guid id)
        {
            try
            {
                await this.service.DeleteAsync(id);
                return NoContent();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}