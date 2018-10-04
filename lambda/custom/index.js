/* eslint-disable  func-names */
/* eslint-disable  no-console */
const fs = require('fs');
const Alexa = require('ask-sdk-core');
const traverse = require('traverse');
//const pdfParse = require('pdf-parser');
//after lunch we are going to use something else

let menuDays = [
  { day: "Sunday",    col: 0},
  { day: "Monday",    col: 3},
  { day: "Tuesday",   col: 12},
  { day: "Wednesday", col: 21},
  { day: "Thursday",  col: 31},
  { day: "Friday",    col: 40}
]

let menuJson = JSON.parse(fs.readFileSync("../../data/pqMenu.json", "utf8"));
//console.log(JSON.stringify(menuJson));

function FindTodaysSoups(day) {
  let dateObj = menuDays[day];
  let options = [];

  traverse(menuJson).reduce((acc, key) => {
    if(key !== undefined){
      if(key.hasOwnProperty('R') && Math.floor(key.x) === dateObj.col) {
            options.push(decodeURI(key.R[0].T));
          }
      }
  });

  return `${options[1]}, ${options[2]}`;
}

FindTodaysMeals(4);

function FindTodaysMeals(day) {
  let dateObj = menuDays[day];
  let options = [];

  traverse(menuJson).reduce((acc, key) => {
    if(key !== undefined){
      if(key.hasOwnProperty('R') && Math.floor(key.x) === dateObj.col) {
            options.push(decodeURI(key.R[0].T));
          }
      }
  });

  return `${options[3]}, ${options[7]}, ${options[12]}${options[13]}, ${options[17]}${options[18]}`;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Pacific Quay Menu. Would you like to learn about the main meals or the soups?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Pacific Quay Menu', speechText)
      .getResponse();
  },
};

const SoupIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SoupIntent';
  },
  handle(handlerInput) {
    const speechText = "Today's soups are " + FindTodaysSoups(new Date().getDay());

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Today's soups are ", speechText)
      .getResponse();
  },
};

const MealsIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MealsIntent';
  },
  handle(handlerInput) {
    const speechText = "Today's meals are " + FindTodaysMeals(new Date().getDay());

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Today's meals are ", speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    SoupIntentHandler,
    MealsIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

