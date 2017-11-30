import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"
import {getNextMatchID} from "./getNextMatchID"



/*
  Deletes a team
*/
export async function removeTeam(team: string): {
  const db = new DynamoDB.DocumentClient()

  const nextMatchID = await getNextMatchID()

  if (nextMatchID) {
    throw new Error("There is a currently pending match. You cannot modify teams once a tournament has started")
  }

var params = {
    TableName:Teams,
    Item:{
        "name": team
    }
};

console.log("Adding a new item...");
db.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
});

}
