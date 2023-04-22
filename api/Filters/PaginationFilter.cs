namespace moneyManager.Filters
{
    public class PaginationFilter
    {
        private int pageNumber;
        private int pageSize;
        public int PageNumber 
        { 
            get { return this.pageNumber; }
            set { this.pageNumber = value < 1 ? 1 : value; }
        }
        public int PageSize { 
            get { return this.pageSize; }
            set { this.pageSize = value > 20 ? 20 : value; }
        }
        public PaginationFilter()
        {
            this.PageNumber = 1;
            this.PageSize = 20;
        }
        public PaginationFilter(int pageNumber, int pageSize)
        {
            this.PageNumber = pageNumber < 1 ? 1 : pageNumber;
            this.PageSize = pageSize > 20 ? 20 : pageSize;
        }
    }
}