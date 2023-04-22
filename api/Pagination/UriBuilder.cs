using Microsoft.AspNetCore.WebUtilities;
using moneyManager.Filters;

namespace moneyManager.Pagination
{
    public class UriBuilder : IUriBuilder
    {
        private readonly string baseUri;
        public UriBuilder(string baseUri)
        {
            this.baseUri = baseUri;
        }

        public Uri GetUri(PaginationFilter filter, string route)
        {
            var endpointUri = QueryHelpers.AddQueryString(this.baseUri + route, "pageNumber", filter.PageNumber.ToString());
            endpointUri = QueryHelpers.AddQueryString(endpointUri, "pageSize", filter.PageSize.ToString());

            return new Uri(endpointUri);
        }
    }
}