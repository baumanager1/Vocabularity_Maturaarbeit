using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData;
using Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary;
using Vocabularity_Server.Models.VocabularyMode.Entities;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Progress
{
    [PrimaryKey(nameof(UserId), nameof(VocabularyId))]
    [Table("uservocabularyprogress")]
    public class UserVocabularyProgress
    {
        [Column("userid")]
        public Guid UserId { get; set; }

        [Column("vocabularyid")]
        public int VocabularyId { get; set; }

        [Column("studied")]
        public bool Studied { get; set; }

        [Column("meaninglearnt")]
        public bool MeaningLearnt { get; set; }

        [Column("readinglearnt")]
        public bool ReadingLearnt { get; set; }

        [Column("learnt")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public bool Learnt { get; set; }

        public User User { get; set; } = null!;

        public JapaneseVocabulary Vocabulary { get; set; } = null!;
    }
}
