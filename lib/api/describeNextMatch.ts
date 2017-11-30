import * as t from "../types"



// returns null if there are no more matches or there is no active bracket
export async function describeNextMatch(): Promise<t.MatchInfo | null> {
  // TODO
  return {
    id: 1,
    status: t.CompletionStatus.Incomplete,
    teamOne: "bob",
    teamTwo: "fred",
    teamOneScore: 0,
    teamTwoScore: 0
  }
}
