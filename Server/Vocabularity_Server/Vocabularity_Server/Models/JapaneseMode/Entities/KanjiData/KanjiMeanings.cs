using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData
{
    [Table("kanjimeanings")]
    public class KanjiMeanings
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

        public Kanji Kanji { get; set; } = null!;
    }
}
