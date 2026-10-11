using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary
{
    [Table("vocabularyreadings")]
    public class VocabularyReadings
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("readingid")]
        public Guid ReadingId { get; set; }

        [Column("reading")]
        public string Reading { get; set; } = "";

        [Column("acceptedanswer")]
        public bool AcceptedAnswer { get; set; }

        public JapaneseVocabulary Vocabulary { get; set; } = null!;
    }
}
