using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Services;
using moneyManager.Exceptions;
using moneyManager.Pagination;
using moneyManager.Filters;

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


        // GET /expenses?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet]
        public async Task<ActionResult<PagedResponse<IEnumerable<ExpenseDto>>>> GetExpensesAsync([FromQuery] PaginationFilter filter) 
        {
            try
            {
                var expenses = await this.service.GetAllAsync(filter, Request.Path.Value!);
                var castedExpenses = new PagedResponse<IEnumerable<ExpenseDto>>(expenses);
                return Ok(castedExpenses);
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
        public async Task<ActionResult<PagedResponse<IEnumerable<ExpenseDto>>>> GetExpensesHigherThanAsync(int nr, [FromQuery] PaginationFilter filter)
        {
            try
            {
                var expenses = await this.service.GetExpensesHigherThanAsync(nr, filter, Request.Path.Value!);
                var castedExpenses = new PagedResponse<IEnumerable<ExpenseDto>>(expenses);
                return Ok(castedExpenses);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
        
        // GET /expenses/total?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet("total")]
        public async Task<ActionResult<PagedResponse<IEnumerable<ExpenseDto>>>> GetExpensesTotalAsync([FromQuery] PaginationFilter filter)
        {
            try
            {
                var expenses = await this.service.GetExpensesTotalAsync(filter, Request.Path.Value!);
                var castedExpenses = new PagedResponse<IEnumerable<ExpenseTotalDto>>(expenses);
                return Ok(castedExpenses);
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