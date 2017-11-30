import {DynamoDB} from "aws-sdk"
import {getNextMatchID} from "./getNextMatchID"
import {Tables, TmpHash} from "../config"



/*
  Submit the given match scores to the currently pending match.
*/
export async function submitMatchScores(teamOneScore: number, teamTwoScore: number): Promise<void> {
  if (teamOneScore === teamTwoScore) {
    throw new Error("Match must not end in a tie")
  }

  const nextMatchID = await getNextMatchID()

  if (!nextMatchID) {
    throw new Error("There is no currently pending match")
  }

  const db = new DynamoDB.DocumentClient()

  const res = await db.update({
    TableName: Tables.BracketMatches,
    Key: {
      tmpHash: TmpHash,
      id: nextMatchID
    },
    ConditionExpression: "#status = :oldStatus",
    UpdateExpression: "SET #status = :newStatus, teamOneScore = :teamOneScore, teamTwoScore = :teamTwoScore, winner = :winner",
    ExpressionAttributeNames: {
      "#status": "status"
    },
    ExpressionAttributeValues: {
      ":newStatus": "COMPLETE",
      ":oldStatus": "PENDING",
      ":teamOneScore": teamOneScore,
      ":teamTwoScore": teamTwoScore,
      ":winner": teamOneScore > teamTwoScore ? "ONE" : "TWO"
    },
    ReturnValues: "ALL_NEW"
  }).promise()

  if (!res.Attributes) {
    throw new Error("Malformed response from DB")
  }

  if (res.Attributes.winnerAdvancesTo) {
    const winningTeam = teamOneScore > teamTwoScore ? res.Attributes.teamOne : res.Attributes.teamTwo
    await advanceTeam(db, winningTeam, res.Attributes.winnerAdvancesTo.match, res.Attributes.winnerAdvancesTo.slot)
  }
  if (res.Attributes.loserAdvancesTo) {
    const losingTeam = teamOneScore > teamTwoScore ? res.Attributes.teamTwo : res.Attributes.teamOne
    await advanceTeam(db, losingTeam, res.Attributes.loserAdvancesTo.match, res.Attributes.loserAdvancesTo.slot)
  }
}



async function advanceTeam(db: DynamoDB.DocumentClient, team: string, match: number, slot: "ONE" | "TWO"): Promise<void> {
  const res = await db.update({
    TableName: Tables.BracketMatches,
    Key: {
      tmpHash: TmpHash,
      id: match
    },
    UpdateExpression: "SET #team = :team",
    ExpressionAttributeNames: {
      "#team": slot === "ONE" ? "teamOne" : "teamTwo"
    },
    ExpressionAttributeValues: {
      ":team": team
    },
    ReturnValues: "ALL_NEW"
  }).promise()

  if (!res.Attributes) {
    throw new Error("Malformed response from DB")
  }

  if (res.Attributes.teamOne && res.Attributes.teamTwo) {
    await db.update({
      TableName: Tables.BracketMatches,
      Key: {
        tmpHash: TmpHash,
        id: match
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": "PENDING"
      }
    }).promise()
  }
}
