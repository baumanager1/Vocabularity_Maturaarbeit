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
        
        
    }
}
