using FluentMigrator;
using Persistence.Models;

namespace Persistence.Migrations
{
    [Migration(01)]
    public class InitialMigration : Migration
    {
        public override void Up()
        {
            Create.Table("Users")
                .WithColumn("Id").AsInt32().NotNullable().PrimaryKey().Identity()
                .WithColumn("FirstName").AsString(64).NotNullable().WithDefaultValue("DefaulFirstName")
                .WithColumn("LastName").AsString(64).NotNullable().WithDefaultValue("DefaultLastName")
                .WithColumn("Age").AsByte().NotNullable().WithDefaultValue(0)
                .WithColumn("Sex").AsString(10).NotNullable().WithDefaultValue(Sex.Non);

            Insert.IntoTable("Users")
                .Row(new { FirstName = "Alice", LastName = "Smith", Age = 30, Sex = Sex.Woman })
                .Row(new { FirstName = "Bob", LastName = "Johnson", Age = 35, Sex = Sex.Man })
                .Row(new { FirstName = "Charlie", LastName = "Williams", Age = 28, Sex = Sex.Man })
                .Row(new { FirstName = "David", LastName = "Brown", Age = 40, Sex = Sex.Man })
                .Row(new { FirstName = "Eva", LastName = "Jones", Age = 25, Sex = Sex.Woman })
                .Row(new { FirstName = "Fiona", LastName = "Garcia", Age = 32, Sex = Sex.Woman })
                .Row(new { FirstName = "George", LastName = "Miller", Age = 29, Sex = Sex.Man })
                .Row(new { FirstName = "Hannah", LastName = "Davis", Age = 31, Sex = Sex.Woman })
                .Row(new { FirstName = "Ian", LastName = "Martinez", Age = 27, Sex = Sex.Man })
                .Row(new { FirstName = "Julia", LastName = "Rodriguez", Age = 33, Sex = Sex.Woman })
                .Row(new { FirstName = "Kevin", LastName = "Hernandez", Age = 36, Sex = Sex.Man })
                .Row(new { FirstName = "Lily", LastName = "Lopez", Age = 24, Sex = Sex.Woman })
                .Row(new { FirstName = "Michael", LastName = "Gonzalez", Age = 38, Sex = Sex.Man })
                .Row(new { FirstName = "Nina", LastName = "Wilson", Age = 26, Sex = Sex.Woman })
                .Row(new { FirstName = "Oscar", LastName = "Anderson", Age = 34, Sex = Sex.Man });
        }

        public override void Down()
        {
            Delete.Table("Users");
        }
    }
}
