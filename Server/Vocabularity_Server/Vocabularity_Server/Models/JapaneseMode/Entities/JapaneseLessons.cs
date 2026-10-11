
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData;
using Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary;

namespace Vocabularity_Server.Models.JapaneseMode.Entities
{
    [Table("japaneselessons")]
    public class JapaneseLessons
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("lessonnumber")] 
        public int LessonNumber { get; set; }

        [Column("lessonid")]
        public Guid LessonId { get; set; }

        public KanjiLessons KanjiLesson { get; set; } = null!;

        public VocabularyLessons VocabularyLesson { get; set; } = null!;
    }

}
