

namespace Vocabularity_Server.Models.VocabularyMode.Requests
{
    public class CreateVocabularySetRequest
    {
        public Guid VocabularySetId {  get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";

        public LanguagePair TermLanguage { get; set; } = new LanguagePair();

        public LanguagePair DefinitionLanguage { get; set; } = new LanguagePair();

        public List<VocabularyCard> Cards { get; set; } = new List<VocabularyCard>();

    }

    public class LanguagePair
    {
        public string languageCode { get; set; } = "";
        public string languageName { get; set; } = "";
    }

    public class VocabularyCard
    {
        public int Id { get; set; }
        public string Term { get; set; } = "";
        public string Definition { get; set; } = "";
    }
}
