import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"
import * as t from "../types"



export async function getTeamStats(team: string): Promise<t.TeamStats | null> {
  // TODO
  return {
    wins: 1,
    losses: 2,
    pointsFor: 20,
    pointsAgainst: 26
  }
}
