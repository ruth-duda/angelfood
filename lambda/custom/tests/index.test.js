const va = require("virtual-alexa");

let alexa = null;

beforeAll(() => {
    alexa = va.VirtualAlexa.Builder()
    .handler("./index.handler")
    .interactionModelFile("../../models/en-US.json")
    .create();

    alexa.dynamoDB().mock();
});

test("test launching the skill: ", async () => {
    let launchResponse = await alexa.launch();

    expect(launchResponse.response.outputSpeech.ssml).toContain("Pacific Quay Menu. Would you like to learn about the main meals or the soups?")

});


test("test the soup intent: ", async () => {
    let utterResponse = await alexa.utter("soups");

    //console.log(utterResponse);

    expect(utterResponse.response.outputSpeech.ssml).toContain("Today's soups are");

})

test("test the meals intent: ", async () => {
    let utterResponse = await alexa.utter("meals");

    console.log(utterResponse);

    expect(utterResponse.response.outputSpeech.ssml).toContain("Today's meals are");
})
