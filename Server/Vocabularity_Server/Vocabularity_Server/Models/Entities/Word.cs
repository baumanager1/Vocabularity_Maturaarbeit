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

        [Column("vocabsetnumber")]
        public int VocabSetNumber { get; set; }

        [ForeignKey(nameof(VocabSetNumber))]
        public VocabularySet VocabularySet { get; set; } = null!;

    }
}
