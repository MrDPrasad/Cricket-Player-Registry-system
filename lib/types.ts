export type PlayerType = 'batsman' | 'bowler' | 'all-rounder' | 'wicketkeeper'

export interface Player {
  id: number
  name: string
  previous_team: string | null
  type: PlayerType
  phone: string | null
  photo_url: string | null
  team_id: number | null
  team_name: string | null
  created_at: string
  is_captain: boolean
  is_vice_captain: boolean
  is_wicketkeeper_role: boolean
}

export interface Team {
  id: number
  name: string
  captain_id: number | null
  vice_captain_id: number | null
  wicketkeeper_id: number | null
  captain_name: string | null
  vice_captain_name: string | null
  wicketkeeper_name: string | null
  player_count: number
  created_at: string
}

export interface Stats {
  total_players: number
  total_teams: number
  batsmen: number
  bowlers: number
  allrounders: number
  wicketkeepers: number
}
