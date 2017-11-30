import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"
import * as t from "../types"



export async function describeBracketStatus(): Promise<t.BracketStatus | null> {
  const db = new DynamoDB.DocumentClient()


  // TODO store additional data in matches: their depth value
  // store a deepest depth on each team entry
  // update team's depth whenever they win a match
  // ranking factors are as follows: deepest depth; most wins; least losses; best point ratio
  // when generating a round-robin bracket, all matches have same depth; for elimination brackets, depth ofc needs to get generated


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
