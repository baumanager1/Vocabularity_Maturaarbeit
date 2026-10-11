using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData
{
    [Table("kanji")]
    public class Kanji
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("kanjiid")]
        public int KanjiId { get; set; }

        [Column("meaningid")] 
        public Guid MeaningId { get; set; }

        [Column("readingid")] 
        public Guid ReadingId { get; set; }

        [Column("lessonid")]
        public Guid LessonId { get; set; }

        [Column("character")]
        public string Character { get; set; } = "";

        public ICollection<KanjiReadings> Readings { get; set; } = new List<KanjiReadings>();

        public ICollection<KanjiMeanings> Meanings { get; set; } = new List<KanjiMeanings>();

        public KanjiLessons KanjiLesson { get; set; } = null!;
    }
}