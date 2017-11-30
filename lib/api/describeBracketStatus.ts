import * as t from "../types"



export function describeBracketStatus(): t.BracketStatus | null {
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
