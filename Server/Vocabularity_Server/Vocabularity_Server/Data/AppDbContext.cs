using Microsoft.EntityFrameworkCore;
using Vocabularity_Server.Models.Entities;
namespace Vocabularity_Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options) 
        { 
        }
        
        public DbSet<VocabularySet> VocabularySets { get; set; }

        public DbSet<Word> Words { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<VocabularySet>()
                .HasAlternateKey(v => v.VocabularySetId);

            modelBuilder.Entity<Word>()
                .HasOne(w => w.VocabularySet)
                .WithMany(v => v.Words)
                .HasForeignKey(w => w.VocabularySetId)
                .HasPrincipalKey(v => v.VocabularySetId);
        }
    }
}
