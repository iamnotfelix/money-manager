using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using moneyManager.Dtos;
using moneyManager.Repositories;
using moneyManager.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<IService<IExpenseDto>, ExpensesService>();
builder.Services.AddScoped<IService<ICategoyDto>, CategoriesService>();
builder.Services.AddScoped<IService<IUserDto>, UsersService>();

builder.Services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false);
builder.Services.AddDbContext<DatabaseContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("Default")!));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});
app.UseAuthentication();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

//sudo dotnet publish -o "/home/ubuntu/moneyManagerApi" -c Release