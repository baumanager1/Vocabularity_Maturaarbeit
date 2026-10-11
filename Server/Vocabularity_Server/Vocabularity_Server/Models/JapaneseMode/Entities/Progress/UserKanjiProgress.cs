using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData;
using Vocabularity_Server.Models.VocabularyMode.Entities;

namespace Vocabularity_Server.Models.JapaneseMode.Entities.Progress
{
    [PrimaryKey(nameof(UserId), nameof(KanjiId))]
    [Table("userkanjiprogress")]
    public class UserKanjiProgress
    {
        [Column("userid")]
        public Guid UserId { get; set; }

        [Column("kanjiid")]
        public int KanjiId { get; set; }

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

        public Kanji Kanji { get; set; } = null!;
    }
}
