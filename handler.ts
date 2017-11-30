import * as Alexa from 'alexa-sdk'
import {describeMatch as descMatch} from './lib/api/describeMatch'
// import './lib/api/describeBracketStatus'
// import './lib/api/describeNextMatch'
// import './lib/api/getTeamStats'
// import './lib/api/listTeams'
import {startNewBracket as startBracket} from './lib/api/startNewBracket'
import {removeAllTeams as removeAllTeams} from './lib/api/removeAllTeams'
import {addTeam as addTeam} from './lib/api/addTeam'
import {removeTeam as removeTeam} from './lib/api/removeTeam'
import {submitMatchScores as submitScores} from './lib/api/submitMatchScores'
import * as types from "./lib/types"

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
  let tournamentTypeMap = {
    "single": types.BracketType.SingleElimination
  }
  'LaunchRequest': function () {
    this.emit('startNewBracket')
  },
  'startNewBracket': async function () {
    await startBracket(tournamentTypeMap[this.event.request.intent.slots.bracketType.value])
    this.response.speak('New bracket has been created.')
    this.emit(':responseReady')
  },
  'describeBracketStatus': function () {
    const tmp_msg = 'we would describe a bracket if we worked.'
    this.response.speak(tmp_msg)
    this.emit(':responseReady')
  },
  'addTeam': async function () {
    let teamName = this.event.request.intent.slots.teamName.value
    await addTeam(teamName)
    this.response.speak('Team '+teamName+' added')
    this.emit(':responseReady')
  },
  'removeTeam': async function () {
    let teamName = this.event.request.intent.slots.teamName.value
    await removeTeam(teamName)
    this.response.speak('Team '+teamName+' removed')
    this.emit(':responseReady')
  },
  'removeAllTeams': async function () {

    this.response.speak('All Teams Removed')
    this.emit(':responseReady')
  },
  'describeMatch': async function () {

    let matchNumber = this.event.request.intent.slots.matchNumber.value

    let res = await descMatch(matchNumber)

    let message = ''

    if (res.status == types.CompletionStatus.Incomplete) {
        message = 'Round ' + String(matchNumber) + 'is still Pendind and is between ' + res.teamOne + ' and ' + res.teamTwo
    } else {
      let winner = ''
      let winnerNum = await calcWinner(res.teamOneScore, res.teamTwoScore)
      if (winnerNum == 1) {
        winner = res.teamOne
      } else {
        winner = res.teamTwo
      }
      message = 'Round ' + String(matchNumber) + 'has finished, the teams were ' + res.teamOne + ' and ' + res.teamTwo + ' with the winner being ' + winner
    }

    this.response.speak(message)
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
  'submitMatchScores': async function () {
    let teamOneScore = this.event.request.intent.slots.teamOneScore.value
    let teamTwoScore = this.event.request.intent.slots.teamTwoScore.value

    await submitScores(teamOneScore, teamTwoScore)

    let message = 'Score for this match has been submited'

    this.response.speak(message)
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



async function generateTeamName(numOfTeams: int) {
  let teamArray = []
  for (let i = 0; i < numOfTeams; i++) {
    teamArray.push('team-' + String(i+1))
  }
  return teamArray
}


async function calcWinner(teamOneScore: number, teamTwoScore: number) {
  if (teamOneScore > teamTwoScore) {
    return 1
  } else {
    return 2
  }
}
