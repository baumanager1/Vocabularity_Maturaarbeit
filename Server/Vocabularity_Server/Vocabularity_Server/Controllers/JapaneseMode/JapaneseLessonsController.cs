using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens.Experimental;
using Vocabularity_Server.Data;
using Vocabularity_Server.Extensions;
using Vocabularity_Server.Models.JapaneseMode.Entities;
using Vocabularity_Server.Models.JapaneseMode.Entities.KanjiData;
using Vocabularity_Server.Models.JapaneseMode.Entities.LearnMode;
using Vocabularity_Server.Models.JapaneseMode.Entities.Progress;
using Vocabularity_Server.Models.JapaneseMode.Requests;
using Vocabularity_Server.Models.VocabularyMode.Entities;
using Vocabularity_Server.Models.VocabularyMode.Requests;

namespace Vocabularity_Server.Controllers.JapaneseMode
{
    [Route("api/japanese")]
    [ApiController]
    [Authorize]
    public class JapaneseLessonsController(AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _appDbContext = context;

        [HttpGet("lessons")]
        public async Task<IActionResult> GetAllLessons()
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
                var lessons = await _appDbContext.JapaneseLessons
                    .OrderBy(j => j.LessonNumber)
                    .AsNoTracking()
                    .Select(j => new
                    {
                        j.LessonNumber,
                        j.LessonId
                    })
                    .ToListAsync();

                if (lessons.Count == 0)
                {
                    return NoContent();
                }

                return Ok(lessons);
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Failed to fetch all the japanese lessons from the Database.",
                    details = ex.Message
                });
            }
        }
        [HttpGet("lesson/{id:guid}")]
        public async Task<IActionResult> GetLesson(Guid id)
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
                var lesson = await _appDbContext.JapaneseLessons
                    .AsNoTracking()
                    .OrderBy(j => j.LessonNumber)
                     .Where(j => j.LessonId == id)

                    .Select(j => new
                    {
                        j.LessonNumber,

                        Kanjis = j.KanjiLesson.Kanjis.Select(k => new
                        {
                            k.KanjiId,
                            k.Character,

                            Meanings = k.Meanings.Select(m => new
                            {
                                m.Meaning,
                                m.MeaningId,
                                m.AcceptedAnswer
                            })
                            .Where(m => m.AcceptedAnswer == true)
                            .ToList(),

                            Readings = k.Readings.Select(r => new
                            {
                                r.Reading,
                                r.ReadingId,
                                r.ReadingType,
                                r.AcceptedAnswer
                            }
                            )
                            .Where(r => r.AcceptedAnswer == true)
                            .ToList()
                        })
                        .OrderBy(k => k.KanjiId)
                        .ToList(),

                        Vocabulary = j.VocabularyLesson.Vocabulary.Select(v => new
                        {
                            v.VocabularyId,
                            v.Word,

                            Meanings = v.Meanings.Select(m => new
                            {
                                m.Meaning,
                                m.MeaningId,
                                m.AcceptedAnswer

                            })
                            .Where(m => m.AcceptedAnswer == true)
                            .ToList(),

                            Readings = v.Readings.Select(r => new
                            {
                                r.Reading,
                                r.ReadingId,
                                r.AcceptedAnswer
                            })
                            .Where(r => r.AcceptedAnswer == true)
                            .ToList()

                        })
                        .OrderBy(v => v.VocabularyId)
                        .ToList()
                    })
                    .FirstOrDefaultAsync();


                if (lesson == null)
                {
                    return NotFound();
                }

                return Ok(lesson);
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Failed to fetch lesson from the Database.",
                    details = ex.Message
                });
            }
        }

        [HttpPatch("item/{japaneseItemId}/type/{japaneseItemType}/study-state")]
        public async Task<IActionResult> ChangeStudyState(JapaneseItemType? japaneseItemType, int? japaneseItemId, [FromBody] ChangeStudyStateJapaneseLessonRequest request)
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }

            if (request.LearnState is not bool learnState)
            {
                return BadRequest(new
                {
                    error = "MISSING_LEARN_STATE",
                    message = "Learn State is required."
                });
            }

            if (japaneseItemId is not int itemId)
            {
                return BadRequest(new
                {
                    error = "MISSING_JAPANESE_ITEM_ID",
                    message = "JapaneseItemId is required."
                });
            }

            if (japaneseItemType is not JapaneseItemType itemType)
            {

                return BadRequest(new
                {
                    error = "MISSING_JAPANESE_ITEM_TYPE",
                    message = "JapaneseItemType is required"
                });

            }

            try
            {
                if (japaneseItemType == JapaneseItemType.KANJI)
                {
                    var kanji = await _appDbContext.Kanjis
                    .OrderBy(k => k.Id)
                    .Where(k => k.KanjiId == japaneseItemId)
                    .FirstOrDefaultAsync();

                    if (kanji == null)
                        return NotFound(new
                        {
                            error = "KANJI_NOT_FOUND",
                            message = "The Kanji does not exist in the Database."
                        });

                    var userkanjiProgress = await _appDbContext.UserKanjiProgresses
                        .Where(kp =>
                        kp.UserId == userId &&
                        kp.KanjiId == japaneseItemId)
                        .FirstOrDefaultAsync();

                    if (userkanjiProgress == null)
                    {
                        userkanjiProgress = new UserKanjiProgress
                        {
                            UserId = userId,
                            KanjiId = itemId,
                            Studied = learnState,
                            MeaningLearnt = false,
                            ReadingLearnt = false

                        };
                        _appDbContext.UserKanjiProgresses.Add(userkanjiProgress);
                    }

                    else
                    {
                        userkanjiProgress.Studied = request.LearnState.Value;

                    }
                    await _appDbContext.SaveChangesAsync();
                    return NoContent();
                }

                else
                {
                    {
                        var meaning = await _appDbContext.JapaneseVocabulary
                            .OrderBy(v => v.Id)
                            .Where(v => v.VocabularyId == japaneseItemId)
                            .FirstOrDefaultAsync();

                        if (meaning == null)
                        {
                            return NotFound(new
                            {
                                error = "MEANING_NOT_FOUND",
                                message = "The Meaning does not exist in the Database."
                            });
                        }

                        var userVocabularyProgress = await _appDbContext.UserVocabularyProgresses
                            .Where(vp =>
                                vp.UserId == User.GetUserId() &&
                                vp.VocabularyId == japaneseItemId)
                            .FirstOrDefaultAsync();

                        if (userVocabularyProgress == null)
                        {
                            userVocabularyProgress = new UserVocabularyProgress
                            {
                                UserId = userId,
                                VocabularyId = itemId,
                                Studied = learnState,
                                MeaningLearnt = false,
                                ReadingLearnt = false
                            };
                            _appDbContext.UserVocabularyProgresses.Add(userVocabularyProgress);
                        }

                        else
                        {
                            userVocabularyProgress.Studied = request.LearnState.Value;

                        }
                        await _appDbContext.SaveChangesAsync();
                        return NoContent();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Failed to fetch lesson from the Database.",
                    details = ex.Message
                });
            }
        }


        [HttpPatch("item/{japaneseItemId}/type/{japaneseItemType}/mode/{japaneseModeType}/learn-state")]
        public async Task<IActionResult> ChangeLearnState(JapaneseModeType? japaneseModeType,
            int? japaneseItemId, JapaneseItemType? japaneseItemType, [FromBody] ChangeLearnstateJapaneseLessonRequest request)
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }

            if (request.LearnState is not bool learnState)
            {
                return BadRequest(new
                {
                    error = "MISSING_LEARN_STATE",
                    message = "Learn State is required."
                });
            }

            if (japaneseItemId is not int itemId)
            {
                return BadRequest(new
                {
                    error = "MISSING_JAPANESE_ITEM_ID",
                    message = "JapaneseItemId is required."
                });
            }

            if (japaneseItemType is not JapaneseItemType itemType)
            {

                return BadRequest(new
                {
                    error = "MISSING_JAPANESE_ITEM_TYPE",
                    message = "JapaneseItemType is required"
                });

            }

            if (japaneseModeType is not JapaneseModeType modeType)
            {
                return BadRequest(new
                {
                    error = "MISSING_JAPANESE_ModeTYPE",
                    message = "JapaneseIModeType is required"
                });
            }

            try
            {
                if (japaneseItemType == JapaneseItemType.KANJI)
                {
                    var kanji = await _appDbContext.Kanjis
                    .AsNoTracking()
                    .OrderBy(k => k.Id)
                    .Where(k => k.KanjiId == itemId)
                    .FirstOrDefaultAsync();

                    if (kanji == null)
                        return NotFound(new
                        {
                            error = "KANJI_NOT_FOUND",
                            message = "The Kanji does not exist in the Database."
                        });

                    var userkanjiProgress = await _appDbContext.UserKanjiProgresses
                        .Where(kp =>
                        kp.UserId == userId &&
                        kp.KanjiId == itemId)
                        .FirstOrDefaultAsync();

                    if (userkanjiProgress == null)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }

                    else
                    {
                        if (japaneseModeType == JapaneseModeType.MEANING)
                        {
                            userkanjiProgress.MeaningLearnt = learnState;
                        }
                        else
                        {
                            userkanjiProgress.ReadingLearnt = learnState;
                        }

                    }
                    await _appDbContext.SaveChangesAsync();
                    return NoContent();
                }
                else
                {
                    var meaning = await _appDbContext.JapaneseVocabulary
                        .AsNoTracking()
                        .OrderBy(v => v.Id)
                        .Where(v => v.VocabularyId == itemId)
                        .FirstOrDefaultAsync();

                    if(meaning == null)
                    {
                        return NotFound(new
                        {
                            error = "MEANING_NOT_FOUND",
                            message = "The Meaning does not exist in the Database."
                        });
                    }

                    var userVocabularyProgress = await _appDbContext.UserVocabularyProgresses
                        .Where(vp =>
                            vp.UserId == userId &&
                            vp.VocabularyId == itemId)
                        .FirstOrDefaultAsync();

                    if (userVocabularyProgress == null)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }

                    else
                    {
                        if (japaneseModeType == JapaneseModeType.MEANING)
                        {
                            userVocabularyProgress.MeaningLearnt = learnState;
                        }
                        else
                        {
                            userVocabularyProgress.ReadingLearnt =learnState;
                        }

                    }
                    await _appDbContext.SaveChangesAsync();
                    return NoContent();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    error = "Failed to fetch lesson from the Database.",
                    details = ex.Message
                });
            }
        }

        [HttpGet("lesson/{lessonId}/progress")]
        public async Task<IActionResult> GetLessonUnlockStatus(Guid lessonId)
        {
            if (User.GetUserId() is not Guid userId)
            {
                return Unauthorized(new
                {
                    error = "INVALID_USER_CLAIM",
                    message = "Please login to continue."
                });
            }

            var lesson = await _appDbContext.JapaneseLessons
                .Where(l => l.LessonId == lessonId)
                .Select(l => (int?) l.LessonNumber)
                .FirstOrDefaultAsync();

            if (lesson  is not int lessonNumber)
            {
                return NotFound(new
                {
                    error = "LESSON_NOT_FOUND",
                    message = "The Lesson does not exist in the Database."
                });
            }
            if(lessonNumber == 1)
            {
                return NoContent();
            }

            var previousLessonId = await _appDbContext.JapaneseLessons
                 .Where(l => l.LessonNumber == lessonNumber - 1)
                 .Select(l => l.LessonId)
                 .FirstAsync();

            var totalKanji = await _appDbContext.Kanjis
                .CountAsync(k => k.LessonId == previousLessonId);

            var learntKanji = await _appDbContext.UserKanjiProgresses
                .CountAsync(kp =>
                kp.UserId == userId &&
                kp.Learnt &&
                _appDbContext.Kanjis.Any(k =>
                    k.KanjiId == kp.KanjiId &&
                    k.LessonId == previousLessonId));

            var totalVocab = await _appDbContext.JapaneseVocabulary
                .CountAsync(v => v.LessonId == previousLessonId);

            var learntVocab = await _appDbContext.UserVocabularyProgresses
                .CountAsync(vp =>
                vp.UserId == userId &&
                vp.Learnt &&
                _appDbContext.JapaneseVocabulary.Any(v =>
                v.VocabularyId == vp.VocabularyId &&
                v.LessonId == previousLessonId));

            
            bool unlocked = learntKanji >= totalKanji && learntVocab >= totalVocab;

            if(!unlocked)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    error = "LESSON_NOT_UNLOCKED",
                    message = "Please study the previous lesson first, to unlock this lesson"
                });
            }

            return NoContent();
        }
    }
}
