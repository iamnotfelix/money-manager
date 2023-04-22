using moneyManager.Pagination;
using moneyManager.Filters;

namespace moneyManager.Services
{
    public interface IService<T>
    {
        Task<PagedResponse<IEnumerable<T>>> GetAllAsync(PaginationFilter paginationFilter, string route);
        Task<T> GetByIdAsync(Guid id);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(Guid id, T entity);
        Task DeleteAsync(Guid id);
    }
}