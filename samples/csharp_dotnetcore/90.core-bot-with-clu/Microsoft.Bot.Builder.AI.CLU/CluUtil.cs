﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using Azure.AI.Language.Conversations;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

[assembly: InternalsVisibleTo("Microsoft.Bot.Builder.AI.CLU.Tests")]
namespace Microsoft.Bot.Builder.AI.CLU
{
    // Utility functions used to extract and transform data from CLU
    internal static class CluUtil
    {
        internal static string NormalizedIntent(string intent) => intent.Replace('.', '_').Replace(' ', '_');

        internal static IDictionary<string, IntentScore> GetIntents(ConversationPrediction prediction)
        {
            var result = new Dictionary<string, IntentScore>();
            foreach (ConversationIntent intent in prediction.Intents)
            {
                result.Add(intent.Category, new IntentScore { Score = intent.ConfidenceScore });
            }
            return result;
        }

        /// <summary>
        /// Returns a RecognizerResult from a conversations project response.
        /// 
        /// Intents: List of Intents with their confidence scores.
        /// Entities: has the object: { "entities" : [{entity1}, {entity2}] }
        /// Properties: Additional Informations returned by the service.
        /// 
        /// </summary>
        internal static RecognizerResult BuildRecognizerResultFromConversations(BasePrediction result, RecognizerResult recognizerResult)
        {
            var conversationPrediction = result as ConversationPrediction;
            recognizerResult.Intents = CluUtil.GetIntents(conversationPrediction);
            recognizerResult.Entities = CluUtil.ExtractEntitiesAndMetadata(conversationPrediction);
            return recognizerResult;
        }

        /// <summary>
        /// Returns a RecognizerResult from the question answering response recieved by an orchestration project.
        /// The recognizer result has similar format to the one returned by the QnAMaker Recognizer:
        /// 
        /// Intents: Indicates whether an answer has been found and contains the confidence score.
        /// Entities: has the object: { "answer" : ["topAnswer.answer"] }
        /// Properties: All answers returned by the Question Answering service.
        /// 
        /// </summary>
        internal static RecognizerResult BuildRecognizerResultFromQuestionAnswering(QuestionAnsweringTargetIntentResult qaResult, RecognizerResult recognizerResult)
        {
            IReadOnlyList<KnowledgeBaseAnswer> qnaAnswers = qaResult.Result.Answers;

            if (qnaAnswers.Count > 0)
            {
                KnowledgeBaseAnswer topAnswer = qnaAnswers[0];
                foreach (var answer in qnaAnswers)
                {
                    if (answer.ConfidenceScore > topAnswer.ConfidenceScore)
                    {
                        topAnswer = answer;
                    }
                }

                recognizerResult.Intents.Add(CluRecognizer.QuestionAnsweringMatchIntent, new IntentScore { Score = topAnswer.ConfidenceScore });

                var answerArray = new JArray();
                answerArray.Add(topAnswer.Answer);
                ObjectPath.SetPathValue(recognizerResult, "entities.answer", answerArray);

                recognizerResult.Properties["answers"] = JsonConvert.SerializeObject(qnaAnswers);
            }
            else
            {
                recognizerResult.Intents.Add("None", new IntentScore { Score = 1.0f });
            }

            return recognizerResult;
        }

        /// <summary>
        /// The Kind value for this recognizer.
        /// </summary>
        internal static RecognizerResult BuildRecognizerResultFromLuis(LuisTargetIntentResult luisResult, RecognizerResult recognizerResult)
        {
            var luisPredictionObject = (JObject)JObject.Parse(luisResult.Result.ToString())["prediction"];
            recognizerResult.Intents = LuisUtil.GetIntents(luisPredictionObject);
            recognizerResult.Entities = LuisUtil.ExtractEntitiesAndMetadata(luisPredictionObject);

            LuisUtil.AddProperties(luisPredictionObject, recognizerResult);
            recognizerResult.Properties.Add("luisResult", luisPredictionObject);

            return recognizerResult;
        }

        internal static JObject ExtractEntitiesAndMetadata(ConversationPrediction prediction)
        {
            var entities = prediction.Entities;
            var entityObject = JsonConvert.SerializeObject(entities);
            var jsonArray = JArray.Parse(entityObject);
            var returnedObject = new JObject();

            returnedObject.Add("entities", jsonArray);
            return returnedObject;
        }

        internal static IDictionary<string, IntentScore> GetIntents(JObject cluResult)
        {
            var result = new Dictionary<string, IntentScore>();
            var intents = cluResult["intents"];
            if (intents != null)
            {
                foreach (var intent in intents)
                {
                    result.Add(NormalizedIntent(intent["category"].Value<string>()), new IntentScore { Score = intent["confidenceScore"] == null ? 0.0 : intent["confidenceScore"].Value<double>() });
                }
            }

            return result;
        }

        internal static JObject ExtractEntitiesAndMetadata(JObject prediction)
        {
            var entities = prediction["entities"];
            var entityObject = new JObject();
            entityObject.Add("entities", entities);

            return entityObject;
        }

        internal static void AddProperties(JObject clu, RecognizerResult result)
        {
            var topIntent = clu["topIntent"];
            var projectType = clu["projectType"];

            if (topIntent != null)
            {
                result.Properties.Add("topIntent", topIntent);
            }

            if(projectType != null)
            {
                result.Properties.Add("projectType", projectType);
            }
        }
    }
}