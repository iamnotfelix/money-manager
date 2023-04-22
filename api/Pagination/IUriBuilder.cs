using moneyManager.Filters;

namespace moneyManager.Pagination
{
    public interface IUriBuilder
    {
        public Uri GetUri(PaginationFilter filter, string route);
    }
}