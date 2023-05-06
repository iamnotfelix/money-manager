using moneyManager.Filters;

namespace moneyManager.Services
{
    public interface IUriBuilder
    {
        public Uri GetUri(PaginationFilter filter, string route);
    }
}