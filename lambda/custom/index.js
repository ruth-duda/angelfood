/* eslint-disable  func-names */
/* eslint-disable  no-console */
const fs = require('fs');
const Alexa = require('ask-sdk-core');

let menuJson = {
  soups: [
    {
      name: "Moroccan Spiced Lentil Soup"
    },
    {
      name: "Cream of Tomato Soup"
    }
  ],
  mains: [
    {
      name: "Grilled Pork Steak",
      description: "Served With an Orange and Fennel Salad "
    },
    {
      name: "Cheese Stuffed Doritos Burger",
      description: "Served With an Jalapeño Poppers or Fries"
    },
    {
      name: "Texas BBQ Sweet Hot Chilli",
      description: "A Smokey Spicy Sweet Hot Version of " +
      "Chilli Con Carne Served With Corn and " +
      "Garden Pea Rice"
    },
    {
      name: "Italian Pesto Gnocchi ",
      description: ""
    }
  ],
}

function FindTodaysSoups(day) {
  let outputString = "";

  menuJson.soups.forEach((soup) => {
    outputString = outputString + soup.name + " ";
  });

  return outputString;
}

function FindTodaysMeals(day) {
  let outputString = "";

  menuJson.mains.forEach((main) => {
    outputString = outputString + main.name + ", " + main.description + " ";
  });

  return outputString;
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

