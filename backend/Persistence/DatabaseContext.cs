using Microsoft.EntityFrameworkCore;
using Persistence.Models;
using Shared.Misc;

namespace Persistence
{
    public class DatabaseContext : DbContext
    {
        private readonly AppSettings appSettings;

        public DbSet<User> Users { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options, AppSettings appSettings) : base(options)
        {
            this.appSettings = appSettings;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(x => x.Sex)
                .HasConversion<string>(x => x.ToString(), x => x.GetEnum());
        }
    }
}
