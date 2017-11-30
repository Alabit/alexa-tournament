import {DynamoDB} from "aws-sdk"
import {Tables, TmpHash} from "../config"
import * as t from "../types"



/*
  Clears out the database (for now), then creates initial data for a new bracket.
*/
export async function startNewBracket(teams: string[], type: t.BracketType): Promise<void> {
  const db = new DynamoDB.DocumentClient()

  await Promise.all([
    clearTable(Tables.BracketMatches, db, (item) => {
      return {
        tmpHash: item.tmpHash,
        id: item.id
      }
    }),
    clearTable(Tables.Teams, db, (item) => {
      return {
        name: item.name
      }
    })
  ])

  await Promise.all([
    createBracket(type, teams, db),
    createTeams(teams, db)
  ])
}



async function clearTable(table: string, db: DynamoDB.DocumentClient, itemToKey: (item: any) => {}): Promise<void> {
  // TODO we need to handle pagination
  const res = await db.scan({
    TableName: table
  }).promise()

  if (res.Items) {
    const batch: {
      [table: string]: Array<{
        DeleteRequest: {
          Key: {}
        }
      }>
    } = {}
    batch[table] = res.Items.map((item) => {
      return {
        DeleteRequest: {
          Key: itemToKey(item)
        }
      }
    })

    await db.batchWrite({
      RequestItems: batch
    }).promise()
  }
}

async function createBracket(type: t.BracketType, teams: string[], db: DynamoDB.DocumentClient): Promise<void> {
  if (teams.length === 0) {
    throw new Error("Unable to make a bracket with zero teams")
  }

  const matches: Array<{}> = []

  switch (type) {
  case t.BracketType.SingleElimination:
    {
      type BracketNode = {
        winnerAdvancesTo?: {
          node: BracketNode
          slot: "ONE" | "TWO"
        }
        loserAdvancesTo?: {
          node: BracketNode
          slot: "ONE" | "TWO"
        }
      } & ({
        type: "SEED",
        team: string
      } | {
        type: "MATCH",
        id: number,
        teamOne: BracketNode,
        teamTwo: BracketNode
      })

      function buildBracket(teams: string[], winnerAdvancesTo?: {node: BracketNode, slot: "ONE" | "TWO"}): BracketNode {
        if (teams.length === 1) {
          return {
            type: "SEED",
            team: teams[0]
          }
        }

        const pivot = Math.floor(teams.length / 2)

        const match: BracketNode = {
          type: "MATCH",
          id: -1,
          winnerAdvancesTo: winnerAdvancesTo,
          loserAdvancesTo: undefined,
          teamOne: null as any,
          teamTwo: null as any
        }
        match.teamOne = buildBracket(teams.slice(0, pivot), {node: match, slot: "ONE"})
        match.teamTwo = buildBracket(teams.slice(pivot), {node: match, slot: "TWO"})
        return match
      }

      const bracket = buildBracket(teams)

      const queue = [bracket]
      for (let i = 0; i < queue.length; i++) {
        const node = queue[i]

        if (node.type === "MATCH") {
          queue.push(node.teamOne)
          queue.push(node.teamTwo)
        }
      }
      let nextMatchID = teams.length - 1
      for (const node of queue) {
        if (node.type === "MATCH") {
          node.id = nextMatchID--
        }
      }

      for (const node of queue) {
        if (node.type === "MATCH") {
          const entry: {
            tmpHash: string
            id: number
            status: "BLOCKED" | "PENDING"
            winnerAdvancesTo?: {
              match: number
              slot: "ONE" | "TWO"
            }
            loserAdvancesTo?: {
              match: number
              slot: "ONE" | "TWO"
            }
            teamOne: string | null
            teamTwo: string | null
          } = {
            tmpHash: TmpHash,
            id: node.id,
            status: "PENDING",
            teamOne: null,
            teamTwo: null
          }

          if (node.teamOne.type === "MATCH") {
            entry.status = "BLOCKED"
          } else {
            entry.teamOne = node.teamOne.team
          }
          if (node.teamTwo.type === "MATCH") {
            entry.status = "BLOCKED"
          } else {
            entry.teamTwo = node.teamTwo.team
          }

          if (node.winnerAdvancesTo) {
            if (node.winnerAdvancesTo.node.type !== "MATCH") {
              throw new Error("Unexpected error while formatting bracket")
            }

            entry.winnerAdvancesTo = {
              match: node.winnerAdvancesTo.node.id,
              slot: node.winnerAdvancesTo.slot
            }
          }
          if (node.loserAdvancesTo) {
            if (node.loserAdvancesTo.node.type !== "MATCH") {
              throw new Error("Unexpected error while formatting bracket")
            }

            entry.loserAdvancesTo = {
              match: node.loserAdvancesTo.node.id,
              slot: node.loserAdvancesTo.slot
            }
          }

          matches.push(entry)
        }
      }
    }
    break
  default:
    throw new Error("Unrecognized bracket type")
  }

  const batch: {
    [table: string]: Array<{
      PutRequest: {
        Item: {}
      }
    }>
  } = {}
  batch[Tables.BracketMatches] = matches.map((match) => {
    return {
      PutRequest: {
        Item: match
      }
    }
  })

  await db.batchWrite({
    RequestItems: batch
  }).promise()
}

async function createTeams(teams: string[], db: DynamoDB.DocumentClient): Promise<void> {
  const batch: {
    [table: string]: Array<{
      PutRequest: {
        Item: {}
      }
    }>
  } = {}
  batch[Tables.Teams] = teams.map((team) => {
    return {
      PutRequest: {
        Item: {
          name: team
        }
      }
    }
  })

  await db.batchWrite({
    RequestItems: batch
  }).promise()
}
