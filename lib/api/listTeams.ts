import {DynamoDB} from "aws-sdk"
import * as t from "../types"



/*
  Lists all teams in the active bracket.
  If there is no active bracket, this returns an empty array.
*/
export async function listTeams(): Promise<string[]> {
  const db = new DynamoDB.DocumentClient()

  // TODO
  return ["fred", "bob"]
}
