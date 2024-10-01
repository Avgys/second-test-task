using chat_backend.Validation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Persistence.Models;
using System.ComponentModel.DataAnnotations;

namespace chat_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Admin(DatabaseContext context, ILogger<Admin> logger) : ControllerBase
    {
        private DatabaseContext dbContext = context;
        private readonly ILogger logger = logger;

        [HttpGet("Users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await dbContext.Users.Select(x => new UserModelId(x)).ToListAsync();
                return Ok(users);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                return BadRequest("Error accessing db");
            }
        }

        [HttpPost("Users")]
        public async Task<IActionResult> AddUserAsync([FromBody] UserModel newUser)
        {
            if (!UserModelValidation.AddValid(newUser))
                return BadRequest("No enough credentials");

            try
            {
                var userDb = newUser.ToDbUser();
                await dbContext.Users.AddAsync(userDb);
                await dbContext.SaveChangesAsync();
                return Ok(new UserModelId(userDb));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                return BadRequest("Error accessing db");
            }
        }

        [HttpPatch("Users")]
        public async Task<IActionResult> UpdateUserAsync(UserModelId newUser)
        {
            if (!ModelState.IsValid)
                return BadRequest("No enough credentials");

            try
            {
                var user = await dbContext.Users.SingleOrDefaultAsync(user => user.Id == newUser.Id);

                if (user == null)
                    return NotFound("No such user");

                user.FirstName = newUser.FirstName ?? user.FirstName;
                user.LastName = newUser.LastName ?? user.LastName;
                user.Age = newUser.Age ?? user.Age;
                user.Sex = newUser.Sex?.GetEnum() ?? user.Sex;

                await dbContext.SaveChangesAsync();
                return Ok(new UserModelId(user));
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                return BadRequest("Error accessing db");
            }
        }

        [HttpDelete("Users")]
        public async Task<IActionResult> DeleteUserAsync([FromQuery(Name = "userId")][Required] string userIds)
        {
            if (string.IsNullOrWhiteSpace(userIds))
                return BadRequest("Empty request");

            var ids = userIds.Split(',');
            var users = new List<User>();

            foreach (var id in ids)
            {
                if (int.TryParse(id, out var value))
                    users.Add(new User { Id = value });
            }

            try
            {
                dbContext.RemoveRange(users);
                await dbContext.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                return BadRequest("Error accessing db");
            }
        }
    }
}
