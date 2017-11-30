import * as t from "../types"



// returns null if the id is invalid or there is no active bracket
export async function describeMatch(id: number): Promise<t.MatchInfo | null> {
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
