import * as Alexa from 'alexa-sdk'

const APP_ID = ''
const HELP_MESSAGE = 'This is a temp help message'
const HELP_REPROMPT = 'Reprompt for Help'
const STOP_MESSAGE = 'We are stopping'

export async function main(event: any, context: any, callback: any) {
  console.log(event)
  console.log(context)

  let alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.registerHandlers(alexaHandlers)
  alexa.execute()
}


const alexaHandlers = {
  'startNewBracket': () => {
    const tmp_msg = 'we would create a new bracket if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'describeBracketStatus': () => {
    const tmp_msg = 'we would describe a bracket if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'describeMatch': () => {
    const tmp_msg = 'we would describe a match if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'describeNextMatch': () => {
    const tmp_msg = 'we would describe the next match if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'getTeamStats': () => {
    const tmp_msg = 'we would describe team stats if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'listTeams': () => {
    const tmp_msg = 'we would describe the team list if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'submitMatchScores': () => {
    const tmp_msg = 'we would submit a score if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'AMAZON.HelpIntent': function () {
     const speechOutput = HELP_MESSAGE;
     const reprompt = HELP_REPROMPT;

     this.response.speak(speechOutput).listen(reprompt);
     this.emit(':responseReady');
   },
   'AMAZON.CancelIntent': function () {
     this.response.speak(STOP_MESSAGE);
     this.emit(':responseReady');
   },
   'AMAZON.StopIntent': function () {
     this.response.speak(STOP_MESSAGE);
     this.emit(':responseReady');
   },
}
