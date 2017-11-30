import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"
import * as t from "../types"



export async function describeBracketStatus(): Promise<t.BracketStatus | null> {
  const db = new DynamoDB.DocumentClient()

  

  // TODO
  // NOTE teamRankings are organized the way they are so that ties can be expressed
  return {
    status: t.CompletionStatus.Complete,
    winner: "bob",
    teamRankings: {
      "fred": 2,
      "bob": 1
    }
  }
}
