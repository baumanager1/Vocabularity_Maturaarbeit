using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData
{
    [Table("kanjilessons")]
    public class KanjiLessons
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("lessonid")]
        public Guid LessonId { get; set; }

        public ICollection<Kanji> Kanjis { get; set; } = new List<Kanji>(); 

        public JapaneseLessons JapaneseLesson { get; set; } = null!;
    }
}
