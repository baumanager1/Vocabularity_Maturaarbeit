using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData
{
    [Table("kanjireadings")]
    public class KanjiReadings
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("readingid")]
        public Guid ReadingId { get; set; }

        [Column("reading")]
        public string Reading { get; set; } = "";

        [Column("readingtype")]
        public string ReadingType { get; set; } = "";

        [Column("acceptedanswer")]
        public bool AcceptedAnswer { get; set; }

        public Kanji Kanji { get; set; } = null!;
    }
}
