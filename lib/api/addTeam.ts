import {DynamoDB} from "aws-sdk"
import {Tables} from "../config"
import {getNextMatchID} from "./getNextMatchID"



/*
  Adds a team
*/
export async function addTeam(team: string): {
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
db.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});

}
