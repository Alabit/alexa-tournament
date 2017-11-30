export enum BracketType {
  SingleElimination
}

export enum CompletionStatus {
  Complete,
  Incomplete
}

export interface BracketStatus {
  status: CompletionStatus
  winner: string
  teamRankings: {
    [team: string]: number
  }
}

export interface MatchInfo {
  id: number
  status: CompletionStatus
  teamOne: string
  teamTwo: string
  teamOneScore: number
  teamTwoScore: number
}

export interface TeamStats {
  wins: number
  losses: number
  pointsFor: number
  pointsAgainst: number
}
