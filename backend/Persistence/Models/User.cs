using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Persistence.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [Range(0, 200)]
        public byte Age { get; set; }
        [Required]
        public Sex Sex { get; set; }
    }

    public enum Sex
    {
        Man,
        Woman,
        Non
    }

    public static class SexExtenstion
    {
        public static Sex GetEnum(this string name) => Enum.TryParse(name, out Sex sex) ? sex : Sex.Non;
    }
}
