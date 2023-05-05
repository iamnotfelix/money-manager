using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Filters;
using moneyManager.Pagination;
using moneyManager.Services;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomesController : ControllerBase
    {
        private readonly IncomesService service;

        public IncomesController(IService<IIncomeDto> service) 
        {
            this.service = (IncomesService) service;
        }


        // GET /incomes?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet]
        public async Task<ActionResult<PagedResponse<IEnumerable<IncomeDto>>>> GetIncomesAsync([FromQuery] PaginationFilter filter) 
        { 
            try
            {
                var incomes = await this.service.GetAllAsync(filter, Request.Path.Value!);
                var castedIncomes = new PagedResponse<IEnumerable<IncomeDto>>(incomes);
                return Ok(castedIncomes);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /incomes/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdIncomeDto>> GetIncomeAsync(Guid id)
        {
            try
            {
                var income = await this.service.GetByIdAsync(id);
                return Ok(income);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
        
        // GET /incomes/total?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet("total")]
        public async Task<ActionResult<PagedResponse<IEnumerable<IncomeTotalDto>>>> GetIncomesTotalAsync([FromQuery] PaginationFilter filter)
        {
            try
            {
                var incomes = await this.service.GetIncomesTotalAsync(filter, Request.Path.Value!);
                var castedIncomes = new PagedResponse<IEnumerable<IncomeTotalDto>>(incomes);
                return Ok(castedIncomes);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // POST /incomes
        [HttpPost]
        public async Task<ActionResult<IncomeDto>> CreateIncomeAsync(CreateIncomeDto income) 
        {
            try
            {
                var newIncome = (GetByIdIncomeDto) await this.service.AddAsync(income);
                return CreatedAtAction(nameof(GetIncomeAsync), new { id = newIncome.Id }, newIncome);
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

        // PUT /incomes/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateIncomeAsync(Guid id, UpdateIncomeDto income) 
        {
            try
            {
                await this.service.UpdateAsync(id, income);
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

        // DELETE /incomes/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteIncomeAsync(Guid id)
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