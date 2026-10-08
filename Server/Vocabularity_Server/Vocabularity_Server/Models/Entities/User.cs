using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.Entities
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        
        [Column("userid")]
        public Guid UserId { get; set; }

        [Column("username")]
        public string Username { get; set; } = "";
        [Column("googleid")]
        public string? GoogleId { get; set; }
        [Column("passwordhash")]
        public string? PasswordHash { get; set; }
        
        public ICollection<VocabularySet> VocabularySets { get; set;} = new List<VocabularySet>();
    }
}
