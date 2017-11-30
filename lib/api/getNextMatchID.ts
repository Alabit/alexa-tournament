import {DynamoDB} from "aws-sdk"
import {Tables, TmpHash} from "../config"



/*
  Finds the next pending match.
  Returns null if there is no pending match.
*/
export async function getNextMatchID(): Promise<number | null> {
  const db = new DynamoDB.DocumentClient()

  const res = await db.query({
    TableName: Tables.BracketMatches,
    KeyConditionExpression: "tmpHash = :tmpHash",
    FilterExpression: "status = :status",
    ExpressionAttributeValues: {
      ":status": "PENDING",
      ":tmpHash": TmpHash
    },
    Limit: 1
  }).promise()

  if (!res.Items) {
    throw new Error("Malformed response from DB")
  }

  if (res.Items.length) {
    return res.Items[0].id
  } else {
    return null
  }
}
