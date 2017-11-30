import * as Alexa from 'alexa-sdk'
// import './lib/api/describeMatch'
// import './lib/api/describeBracketStatus'
// import './lib/api/describeNextMatch'
// import './lib/api/getTeamStats'
// import './lib/api/listTeams'
import {startNewBracket as startBracket} from './lib/api/startNewBracket'
// import './lib/api/submitMatchScores'

const APP_ID = 'amzn1.ask.skill.37443e25-6717-47d9-971c-a64c1742422c'
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
  'LaunchRequest': function () {
    this.emit('startNewBracket')
  },
  'startNewBracket': async function () {
    const resp = 'New bracket has been created.'

    console.log(this.event.request.intent.slots)

    let teams = this.event.request.intent.slots.numOfTeams.value
    let bracketType = this.event.request.intent.slots.bracketType.value

    console.log('teams: ', teams)
    console.log('bracket type: ', bracketType)

    await startBracket(teams, bracketType)
    this.response.speak(resp)
    this.emit(':responseReady')
  },
  'describeBracketStatus': function () {
    const tmp_msg = 'we would describe a bracket if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'describeMatch': function () {
    const tmp_msg = 'we would describe a match if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'describeNextMatch': function () {
    const tmp_msg = 'we would describe the next match if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'getTeamStats': function () {
    const tmp_msg = 'we would describe team stats if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'listTeams': function () {
    const tmp_msg = 'we would describe the team list if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'submitMatchScores': function () {
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
