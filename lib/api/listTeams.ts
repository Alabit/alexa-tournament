import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"



/*
  Lists all teams in the active bracket.
  If there is no active bracket, this returns an empty array.
*/
export async function listTeams(): Promise<string[]> {
  const db = new DynamoDB.DocumentClient()

  const res = await db.scan({
    TableName: Tables.Teams
  }).promise()

  // TODO we need to handle pagination

  if (!res.Items) {
    throw new Error("Malformed response from database")
  }

  return res.Items.map((item) => item.name)
}
