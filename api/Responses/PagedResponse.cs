using moneyManager.Dtos;
using moneyManager.Filters;
using moneyManager.Services;

namespace moneyManager.Responses
{
    public class PagedResponse<T> : Response<T>
    {
        public PagedResponse(PagedResponse<IEnumerable<IExpenseDto>> response) : base ((T) response.Data)
        {
            this.PageNumber = response.PageNumber;
            this.PageSize = response.PageSize;
            this.TotalPages = response.TotalPages;
            this.TotalRecords = response.TotalRecords;
            this.NextPage = response.NextPage;
            this.PreviousPage = response.PreviousPage;
        }

        public PagedResponse(PagedResponse<IEnumerable<ICategoryDto>> response) : base ((T) response.Data)
        {
            this.PageNumber = response.PageNumber;
            this.PageSize = response.PageSize;
            this.TotalPages = response.TotalPages;
            this.TotalRecords = response.TotalRecords;
            this.NextPage = response.NextPage;
            this.PreviousPage = response.PreviousPage;
        }
        
        public PagedResponse(PagedResponse<IEnumerable<IUserDto>> response) : base ((T) response.Data)
        {
            this.PageNumber = response.PageNumber;
            this.PageSize = response.PageSize;
            this.TotalPages = response.TotalPages;
            this.TotalRecords = response.TotalRecords;
            this.NextPage = response.NextPage;
            this.PreviousPage = response.PreviousPage;
        }
       
        public PagedResponse(PagedResponse<IEnumerable<IIncomeDto>> response) : base ((T) response.Data)
        {
            this.PageNumber = response.PageNumber;
            this.PageSize = response.PageSize;
            this.TotalPages = response.TotalPages;
            this.TotalRecords = response.TotalRecords;
            this.NextPage = response.NextPage;
            this.PreviousPage = response.PreviousPage;
        }


        public PagedResponse(T data, int pageNumber, int pageSize) : base(data)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
        }

        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public Uri? NextPage { get; set; }
        public Uri? PreviousPage { get; set; }

        public static PagedResponse<IEnumerable<T>> CreatePagedReponse(IEnumerable<T> pagedData, PaginationFilter filter, int totalRecords, IUriBuilder uriBuilder, string route)
        {
            var respose = new PagedResponse<IEnumerable<T>>(pagedData, filter.PageNumber, filter.PageSize);
            var totalPages = Convert.ToInt32(Math.Ceiling((double)totalRecords / (double)filter.PageSize));

            respose.NextPage =
                filter.PageNumber >= 1 && filter.PageNumber < totalPages
                ? uriBuilder.GetUri(new PaginationFilter(filter.PageNumber + 1, filter.PageSize), route)
                : null;

            respose.PreviousPage =
                filter.PageNumber - 1 >= 1 && filter.PageNumber <= totalPages
                ? uriBuilder.GetUri(new PaginationFilter(filter.PageNumber - 1, filter.PageSize), route)
                : null;

            respose.TotalPages = totalPages;
            respose.TotalRecords = totalRecords;

            return respose;
        }
    }
}