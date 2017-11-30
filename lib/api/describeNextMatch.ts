import {describeMatch} from "./describeMatch"
import {getNextMatchID} from "./getNextMatchID"
import * as t from "../types"



/*
  Finds the next pending match and returns its details.
  Returns null if there is no pending match.
*/
export async function describeNextMatch(): Promise<t.MatchInfo | null> {
  const nextMatchID = await getNextMatchID()

  if (nextMatchID) {
    // TODO this is actually inefficient; we only need to project the doc we already queried, but we are going to query it again for no reason
    return await describeMatch(nextMatchID)
  } else {
    return null
  }
}
