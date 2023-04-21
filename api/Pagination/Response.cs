
namespace moneyManager.Pagination
{
    public class Response<T>
    {
        public Response(T data)
        {
            this.Data = data; 
        }
        public T Data { get; set; }
    }
}