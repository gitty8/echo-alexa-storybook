/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';


var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Hi, welcome to your child’s audio library. What do you want me to play?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "RecipeIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "Recipe for " + itemName,
            recipe = recipes[itemName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: recipe,
                type: AlexaSkill.speechOutputType.SSML
            };
            response.tellWithCard(speechOutput, cardTitle, recipe);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently don't know " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently don't know. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.SSML
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.SSML
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can choose a genre. I currently have learning audio, songs, and stories. If you know the title of your selection, say PLAY and then say the title of the audio";
        var repromptText = "You can say things like, play a song, read a story, or play something educational";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.SSML
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.SSML
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
