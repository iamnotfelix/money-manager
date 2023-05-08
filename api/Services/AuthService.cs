using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Models;
using moneyManager.Repositories;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using moneyManager.Responses;
using System.Security.Cryptography;

namespace moneyManager.Services
{
    public class AuthService : IAuthService
    {
        private readonly DatabaseContext context;
        public AuthService(DatabaseContext context)
        {
            this.context = context;
        }

        public async Task<string> RegisterAsync(RegisterUserDto user)
        {
            if (this.context.Users.Any(u => u.Username == user.Username))
            {
                throw new ValidationException("Username already exists.");
            }

            var actualUser = new User() {
                Id = Guid.NewGuid(),
                Username = user.Username,
                Email = user.Email,
                Password = user.Password,
                Roles = "Regular",
                DateCreated = DateTime.Now,
                ActivationToken = CreateActivationToken(),
                Expires = DateTime.Now.AddMinutes(10),
                Active = false
            };
            actualUser.Validate();

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            actualUser.Password = passwordHash;

            this.context.Users.Add(actualUser);
            await this.context.SaveChangesAsync();

            return actualUser.ActivationToken;
        }

        public async Task<GetByIdUserDto> ActivateAsync(string activationToken) 
        {
            var user = this.context.Users.FirstOrDefault(u => u.ActivationToken == activationToken);
            if (user is null) 
            {
                throw new NotFoundException("Token is invalid.");
            }

            if (user.Expires < DateTime.Now)
            {
                throw new ValidationException("Token is expired.");
            }

            user.Active = true;
            await this.context.SaveChangesAsync();

            return user.AsGetByIdDto();
        }
        
        public async Task<LoginResponse<GetByIdUserDto>> Login(LoginUserDto user)
        {
            var actualUser = await Task.FromResult(this.context.Users.FirstOrDefault(u => u.Username == user.Username)); // TODO: should remove task.fromresult; here because of warning
            if (actualUser is null) 
            {
                throw new NotFoundException("Username or password are incorrect.");
            }

            if (!BCrypt.Net.BCrypt.Verify(user.Password, actualUser.Password))
            {
                throw new NotFoundException("Username or password are incorrect.");
            }

            string token = CreateJwtToken(actualUser);

            var loginResponse = new LoginResponse<GetByIdUserDto>(actualUser.AsGetByIdDto(), token);
            
            return loginResponse;
        }

        private string CreateJwtToken(User user) 
        {
            DotNetEnv.Env.Load();
            
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username!)
            };

            List<string> roles = user.Roles!.Split(',').ToList();
            roles.ForEach(role => claims.Add(new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("KEY")!
            ));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private string CreateActivationToken() {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        }
    }
}