using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using moneyManager.Dtos;
using moneyManager.Repositories;
using moneyManager.Services;

// Load enviroment variables 

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => 
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IUriBuilder>(o => new moneyManager.Services.UriBuilder(Environment.GetEnvironmentVariable("BASE_URI")!));

builder.Services.AddScoped<IService<IExpenseDto>, ExpensesService>();
builder.Services.AddScoped<IService<ICategoryDto>, CategoriesService>();
builder.Services.AddScoped<IService<IUserDto>, UsersService>();
builder.Services.AddScoped<IService<IIncomeDto>, IncomesService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false);
// builder.Services.AddDbContext<DatabaseContext>(options => options.UseMySQL(builder.Configuration.GetConnectionString("Default")!));
builder.Services.AddDbContext<DatabaseContext>(options => options.UseMySQL(Environment.GetEnvironmentVariable("CONNECTION_STRING")!));

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
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

//sudo dotnet publish -o "/home/ubuntu/moneyManagerApi" -c Release