import {DynamoDB} from "aws-sdk"
import {Tables, TmpHash} from "../config"
import * as t from "../types"



/*
  Aggregates the stats for the given team in the active bracket.
  Returns null if the team doesn't exist or there is no active bracket.
*/
export async function getTeamStats(team: string): Promise<t.TeamStats | null> {
  const db = new DynamoDB.DocumentClient()

  // TODO actually check if the team exists

  // TODO handle pagination
  const res = await db.query({
    TableName: Tables.BracketMatches,
    KeyConditionExpression: "tmpHash = :tmpHash",
    FilterExpression: "status = :status AND (teamOne = :team OR teamTwo = :team)",
    ExpressionAttributeValues: {
      ":status": "COMPLETE",
      ":team": team,
      ":tmpHash": TmpHash
    }
  }).promise()

  if (!res.Items) {
    throw new Error("Malformed response from DB")
  }

  const stats = {
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0
  }

  for (const match of res.Items) {
    const thisTeamIsTeamOne = match.teamOne === team

    if (thisTeamIsTeamOne) {
      stats.pointsFor += match.teamOneScore
      stats.pointsAgainst += match.teamTwoScore
    } else {
      stats.pointsFor += match.teamTwoScore
      stats.pointsAgainst += match.teamOneScore
    }

    if (match.winner === "ONE") {
      if (thisTeamIsTeamOne) {
        stats.wins++
      } else {
        stats.losses++
      }
    } else {
      if (thisTeamIsTeamOne) {
        stats.losses++
      } else {
        stats.wins++
      }
    }
  }

  return stats
}
