using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary
{
    [Table("vocabularymeanings")]
    public class VocabularyMeanings
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("meaningid")]
        public Guid MeaningId { get; set; }

        [Column("meaning")]
        public string Meaning { get; set; } = "";

        [Column("acceptedanswer")]
        public bool AcceptedAnswer { get; set; }

        public JapaneseVocabulary Vocabulary { get; set; } = null!;
    }
}
