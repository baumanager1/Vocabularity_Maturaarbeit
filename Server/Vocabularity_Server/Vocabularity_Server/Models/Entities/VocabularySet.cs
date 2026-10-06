using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Vocabularity_Server.Models.Entities
{
    [Table("vocabularysets")]
    public class VocabularySet
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }
        [Column("vocabularysetid")]
        public Guid VocabularySetId { get; set; }

        [Column("title")]
        public string Title { get; set; } = "";

        [Column("description")]
        public string? Description { get; set; }

        [Column("termlanguage")]
        public string TermLanguage { get; set; } = "";

        [Column("definitionlanguage")]
        public string DefinitionLanguage { get; set; } = "";

        public List<Word> Words { get; set; } = new List<Word> { };
    }
}
