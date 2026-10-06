using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.Entities
{
    [Table("words")]
    public class Word
    {
    
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("term")]
        public string Term { get; set; } = "";

        [Column("definition")]
        public string Definition { get; set; } = "";

        [Column("is_learned")]
        public bool learnState { get; set; }

        [Column("vocabularysetid")]
        public Guid VocabularySetId { get; set; }

        [ForeignKey(nameof(VocabularySetId))]
        public VocabularySet VocabularySet { get; set; } = null!;

    }
}
