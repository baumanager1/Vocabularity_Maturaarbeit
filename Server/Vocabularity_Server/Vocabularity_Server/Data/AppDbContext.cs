using Microsoft.EntityFrameworkCore;
using Vocabularity_Server.Models.JapaneseMode.Entities;
using Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData;
using Vocabularity_Server.Models.JapaneseMode.Entities.Progress;
using Vocabularity_Server.Models.JapaneseMode.Entities.Vocabulary;
using Vocabularity_Server.Models.VocabularyMode.Entities;
namespace Vocabularity_Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base (options) 
        { 
        }
        
        // ------Vocabulary Mode--------
        public DbSet<VocabularySet> VocabularySets { get; set; }

        public DbSet<Word> Words { get; set; }

        public DbSet<User> Users { get; set; }

        //------Japanese Mode--------
        // Japanese Lessons
        public DbSet<JapaneseLessons> JapaneseLessons { get; set; }
        public DbSet<KanjiLessons> KanjiLessons { get; set; }
        public DbSet<VocabularyLessons> VocabularyLessons { get; set; }

        // Kanji
        public DbSet<Kanji> Kanjis { get; set; }
        public DbSet<KanjiMeanings> KanjiMeanings { get; set; }
        public DbSet<KanjiReadings> KanjiReadings { get; set; }

        // Vocabulary
        public DbSet<JapaneseVocabulary> JapaneseVocabulary { get; set; }
        public DbSet<VocabularyMeanings> VocabularyMeanings { get; set; }
        public DbSet<VocabularyReadings> VocabularyReadings { get; set; }


        // User Progress
        public DbSet<UserKanjiProgress> UserKanjiProgresses { get; set; }
        public DbSet<UserVocabularyProgress> UserVocabularyProgresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Vocabulary Mode
            modelBuilder.Entity<VocabularySet>()
                .HasAlternateKey(v => v.VocabularySetId);


            modelBuilder.Entity<VocabularySet>()
                .HasOne(v => v.User)
                .WithMany(u => u.VocabularySets)
                .HasForeignKey(v => v.UserId)
                .HasPrincipalKey(u => u.UserId);


            modelBuilder.Entity<Word>()
                .HasOne(w => w.VocabularySet)
                .WithMany(v => v.Words)
                .HasForeignKey(w => w.VocabularySetId)
                .HasPrincipalKey(v => v.VocabularySetId);

            // User Handling
            modelBuilder.Entity<User>()
                .Property(u => u.UserId)
                .HasDefaultValueSql("gen_random_uuid()")
                .ValueGeneratedOnAdd();
              

            modelBuilder.Entity<User>()
                 .HasAlternateKey(u => u.UserId);

            // Japanese Mode


            modelBuilder.Entity<Kanji>()
                .HasOne(k => k.KanjiLesson)
                .WithMany(l => l.Kanjis)
                .HasForeignKey(k => k.LessonId)
                .HasPrincipalKey(l => l.LessonId);

            modelBuilder.Entity<KanjiMeanings>()
                .HasOne(m => m.Kanji)
                .WithMany(k => k.Meanings)
                .HasForeignKey(m => m.MeaningId)
                .HasPrincipalKey(k => k.MeaningId);

            modelBuilder.Entity<VocabularyLessons>()
                .HasOne(v => v.JapaneseLesson)
                .WithOne(j => j.VocabularyLesson)
                .HasForeignKey<VocabularyLessons>(v=> v.LessonId)
                .HasPrincipalKey<JapaneseLessons>(j => j.LessonId);

            modelBuilder.Entity<JapaneseVocabulary>()
                .HasOne(v => v.VocabularyLesson)
                .WithMany(l => l.Vocabulary)
                .HasForeignKey(v => v.LessonId)
                .HasPrincipalKey(l => l.LessonId);

            modelBuilder.Entity<KanjiReadings>()
                .HasOne(r=> r.Kanji)
                .WithMany(k => k.Readings)
                .HasForeignKey(r => r.ReadingId)
                .HasPrincipalKey(k => k.ReadingId);

            modelBuilder.Entity<VocabularyMeanings>()
                .HasOne(m => m.Vocabulary)
                .WithMany(v => v.Meanings)
                .HasForeignKey(m  => m.MeaningId)
                .HasPrincipalKey(v  => v.MeaningId);

            modelBuilder.Entity<VocabularyReadings>()
                .HasOne(r => r.Vocabulary)
                .WithMany(v => v.Readings)
                .HasForeignKey(r => r.ReadingId )
                .HasPrincipalKey (v => v.ReadingId);

            modelBuilder.Entity<UserKanjiProgress>()
                .HasOne(kp => kp.Kanji)
                .WithMany()
                .HasForeignKey(kp => kp.KanjiId)
                .HasPrincipalKey(k => k.KanjiId);

            modelBuilder.Entity<UserKanjiProgress>()
              .HasOne(kp => kp.User)
              .WithMany()
              .HasForeignKey(kp => kp.UserId)
              .HasPrincipalKey(u => u.UserId);


            modelBuilder.Entity<UserVocabularyProgress>()
                .HasOne(vp => vp.User)
                .WithMany()
                .HasForeignKey(vp => vp.UserId)
                .HasPrincipalKey(u => u.UserId);

            modelBuilder.Entity<UserVocabularyProgress>()
                .HasOne(vp => vp.Vocabulary)
                .WithMany()
                .HasForeignKey(vp => vp.VocabularyId)
                .HasPrincipalKey(v => v.VocabularyId);

            modelBuilder.Entity<KanjiLessons>()
                .HasOne(k => k.JapaneseLesson)
                .WithOne(j => j.KanjiLesson)
                .HasForeignKey<KanjiLessons>(k => k.LessonId)
                .HasPrincipalKey<JapaneseLessons>(j => j.LessonId);
        }
    }
}
