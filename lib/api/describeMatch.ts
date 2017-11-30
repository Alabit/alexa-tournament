import {DynamoDB} from "aws-sdk"
import {Tables, TmpHash} from "../config"
import * as t from "../types"



/*
  Retrieve details about the given match.
  Returns null if the ID is invalid or there is no active bracket.
*/
export async function describeMatch(id: number): Promise<t.MatchInfo | null> {
  const db = new DynamoDB.DocumentClient()

  const res = await db.get({
    TableName: Tables.BracketMatches,
    Key: {
      tmpHash: TmpHash,
      id: id
    }
  }).promise()

  if (!res.Item) {
    return null
  }

  return {
    id: res.Item.id,
    status: res.Item.status,
    teamOne: res.Item.teamOne || "<TBD>",
    teamTwo: res.Item.teamTwo || "<TBD>",
    teamOneScore: res.Item.teamOneScore || 0,
    teamTwoScore: res.Item.teamTwoScore || 0
  }
}
