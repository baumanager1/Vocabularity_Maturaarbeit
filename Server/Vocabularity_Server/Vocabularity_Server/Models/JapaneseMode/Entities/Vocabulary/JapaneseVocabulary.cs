using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary
{
    [Table("japanesevocabulary")]
    public class JapaneseVocabulary
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("vocabularyid")]
        public int VocabularyId { get; set; }

        [Column("meaningid")]
        public Guid MeaningId { get; set; }

        [Column("readingid")]
        public Guid ReadingId { get; set; }

        [Column("lessonid")]
        public Guid LessonId { get; set; }

        [Column("word")]
        public string Word { get; set; } = "";

        public ICollection<VocabularyReadings> Readings { get; set; } = new List<VocabularyReadings>();

        public ICollection<VocabularyMeanings> Meanings { get; set; } = new List<VocabularyMeanings>();

        public VocabularyLessons VocabularyLesson { get; set; } = null!;
    }
}
