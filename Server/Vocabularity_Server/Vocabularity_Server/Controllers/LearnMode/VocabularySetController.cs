using Microsoft.AspNetCore.Mvc;
using Vocabularity_Server.Models.VocabularyMode.Requests;
using System.Diagnostics;
using Vocabularity_Server.Data;
using Vocabularity_Server.Models.Entities;
using Microsoft.EntityFrameworkCore;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vocabularity_Server.Controllers.LearnMode
{
    [Route("api/learnmode/vocabset/")]
    [ApiController]
    public class VocabularySetController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public VocabularySetController(AppDbContext context)
        {
            _appDbContext = context;
        }

        // GET: api/<VocabularySetscontroller>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<VocabularySetscontroller>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<VocabularySetscontroller>
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [HttpPost("create")]
        public async Task<IActionResult> CreateVocabSet([FromBody] CreateVocabularySetRequest request)
        {
            Debug.WriteLine(request.Title);

            Debug.WriteLine(request.TermLanguage.languageName);
            Debug.WriteLine(request.TermLanguage.languageCode);
            Debug.WriteLine(request.DefinitionLanguage.languageName);
            Debug.WriteLine(request.DefinitionLanguage.languageCode);

            foreach (var card in request.Cards)
            {
                Debug.WriteLine($"{card.Term} -> {card.Definition}");
            }

            try
            {


                var vocabularySet = new VocabularySet
                {
                    Title = request.Title,
                    Description = request.Description,
                    TermLanguage = request.TermLanguage.languageCode,
                    DefinitionLanguage = request.DefinitionLanguage.languageCode,

                    Words = request.Cards.Select(card => new Word
                    {
                        Term = card.Term,
                        Definition = card.Definition,
                    }).ToList()
                };
                bool titleExists = await _appDbContext.VocabularySets
                .AnyAsync(v => v.Title.ToLower() == request.Title.ToLower());

                if (titleExists)
                {
                    return Conflict(new
                    {
                        error = "DUPLICATE_TITLE",
                        message = "A vocabulary set with this title already exists."
                    });
                }

                else if (vocabularySet.TermLanguage.Equals(vocabularySet.DefinitionLanguage))
                    return Conflict(new
                    {
                        error = "SAME_LANGUAGE",
                        message = "The vocabulary set cannot have the same language for the definition and for the term."
                    });

                // if no conflicts, write vocabulary set to Database
                _appDbContext.VocabularySets.Add(vocabularySet);
                await _appDbContext.SaveChangesAsync();


                return StatusCode(StatusCodes.Status201Created,"The Vocabulary Set has been successfully created.");
            }

            // if conflict during writing data into the database, return HTTP 500 + ErrorMessage
            catch(DbUpdateException ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        error = "Failed to create Vocabulary Set.",
                        details = ex.Message
                    }
                );
            }
        }

        // PUT api/<VocabularySetscontroller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<VocabularySetscontroller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
