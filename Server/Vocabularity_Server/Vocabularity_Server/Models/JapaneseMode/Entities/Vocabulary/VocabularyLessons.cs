using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary
{
    [Table("vocabularylessons")]
    public class VocabularyLessons
    {
        [Column("id")]
        [Key]
        public int Id { get; set; }

        [Column("lessonid")]
        public Guid LessonId { get; set; }

        public JapaneseLessons JapaneseLesson { get; set; } = null!;

        public ICollection<JapaneseVocabulary> Vocabulary { get; set; } = new List<JapaneseVocabulary>();
    }
}
