using Persistence.Models;
using System.ComponentModel.DataAnnotations;

namespace chat_backend
{
    public class UserModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [Range(0, 200)]
        public byte? Age { get; set; }
        public string? Sex { get; set; }

        public UserModel() {}

        public UserModel(User dbModel)
        {
            FirstName = dbModel.FirstName;
            LastName = dbModel.LastName;
            Age = dbModel.Age;
            Sex = dbModel.Sex.ToString();
        }

        public virtual User ToDbUser()
        {
            return new User {
                FirstName = FirstName,
                LastName = LastName,
                Age = Age ?? 0,
                Sex = Sex?.GetEnum() ?? Persistence.Models.Sex.Non,
            };
        }
    }

    public class UserModelId : UserModel
    {
        [Required]
        public int Id { get; set; }

        public UserModelId() { }

        public UserModelId(User dbModel) : base(dbModel)
        {
            Id = dbModel.Id;
        }

        public override User ToDbUser()
        {
            var user = base.ToDbUser();
            user.Id = Id;
            return user;
        }
    }
}
