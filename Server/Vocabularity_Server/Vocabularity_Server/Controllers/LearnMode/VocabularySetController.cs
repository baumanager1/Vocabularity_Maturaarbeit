using Microsoft.AspNetCore.Mvc;
using Vocabularity_Server.Models.VocabularyMode.Requests;
using System.Diagnostics;
using Vocabularity_Server.Data;
using Vocabularity_Server.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Vocabularity_Server.Extensions;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vocabularity_Server.Controllers.LearnMode
{
    [Authorize]
    [Route("api/learnmode/vocabset")]
    [ApiController]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]


    public class VocabularySetController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _appDbContext = context;

        [HttpGet("all-sets")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]


        public async Task<IActionResult> GetAllSets()
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }

            try
            {
                var vocabularySets = await _appDbContext.VocabularySets
                    .Where(v => v.UserId == userId)
                    .Select(v => new
                    {
                        v.VocabularySetId,
                        v.Title,
                        v.Description,
                        v.TermLanguage,
                        v.DefinitionLanguage,
                    })
                    .ToListAsync();

                if(vocabularySets.Count == 0)
                {
                    return NoContent();
                }

                return Ok(vocabularySets);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Failed to fetch all the vocabulary sets from the Database.",
                    details = ex.Message
                });
            }
        }

        // GET api/<VocabularySetscontroller>/5
        [HttpGet("{vocabsetId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]



        public async Task<IActionResult> GetVocabularySet(Guid vocabsetId)
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }

            try
            {
                var vocabSet = await _appDbContext.VocabularySets
                    .Where(v => v.VocabularySetId == vocabsetId &&
                                v.UserId == userId
                    )
                    .Select(v => new
                    {
                        v.TermLanguage,
                        v.DefinitionLanguage,

                        Words = v.Words.Select(w => new
                        {
                            w.Id,
                            w.Term,
                            w.Definition
                            
                        }).ToList()

                    })
                    .FirstOrDefaultAsync();
                if (vocabSet != null) {
                    return Ok(vocabSet);

                }
                else
                {
                    return NotFound(
                    new
                    {
                        error = "VOCABSET_ID_NULL",
                        message = "There doesn't exist a vocabulary set matching the provided id."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                new
                {
                    error = "Failed to fetch vocabulary set.",
                    details = ex.Message
                });
            }
        }

        // POST api/<VocabularySetscontroller>
        [ProducesResponseType(StatusCodes.Status201Created)]
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
                if(User.GetUserId() is not Guid userId)
                {
                    return Unauthorized(new
                    {
                        error = "INVALID_USER_CLAIM",
                        message = "Please login to continue."
                    });
                }

                var vocabularySet = new VocabularySet
                {
                    VocabularySetId = request.VocabularySetId,
                    Title = request.Title,
                    Description = request.Description,
                    TermLanguage = request.TermLanguage.languageCode,
                    DefinitionLanguage = request.DefinitionLanguage.languageCode,

                    Words = request.Cards.Select(card => new Word
                    {
                        Term = card.Term,
                        Definition = card.Definition,
                    }).ToList(),
                    UserId = userId
                };
                bool titleExists = await _appDbContext.VocabularySets
                .AnyAsync(v => 
                v.Title.ToLower() == request.Title.ToLower() &&
                v.UserId == userId
                );

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
                        details  = ex.GetBaseException().Message
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

        [HttpPatch("{vocabularySetId}/words/{wordId}/learn-state")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]


        public async Task<IActionResult> ChangeLearnState(
            Guid? vocabularySetId,
            int? wordId,
            [FromBody] ChangeLearnstateVocabSetRequest request)
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }


            if (vocabularySetId == null)
            {
                return BadRequest(new
                {
                    error = "MISSING_VOCABULARY_SET_ID",
                    message = "VocabularySetId is required."
                });
            }

            if (request.learnState == null)
            {
                return BadRequest(new
                {
                    error = "MISSING_LEARN_STATE",
                    message = "Learn State is required."
                });
            }

            if (wordId == null)
            {
                return BadRequest(new
                {
                    error = "MISSING_WORD_ID",
                    message = "WordId is required."
                });
            }

            var word = await _appDbContext.Words
                .FirstOrDefaultAsync(w =>
                w.Id == wordId &&
                w.VocabularySetId == vocabularySetId.Value
                && w.VocabularySet.UserId == userId
                );


            if (word == null)
            {
                return NotFound(new
                {
                    error = "WORD_NOT_FOUND",
                    message = "The word does not exist in this vocabulary set."
                });
            }

            try
            {
                word.learnState = request.learnState.Value;
                await _appDbContext.SaveChangesAsync();

                return NoContent();
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                new
                {
                    error = "Failed to Patch Vocabulary Set.",
                    details = ex.GetBaseException().Message
                });

            }
        }
    }
}
