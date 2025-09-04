import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'player'
          oro_balance: number
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'player'
          oro_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'player'
          oro_balance?: number
          created_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          entry_fee: number
          total_budget: number
          is_locked: boolean
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          entry_fee: number
          total_budget: number
          is_locked?: boolean
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          entry_fee?: number
          total_budget?: number
          is_locked?: boolean
          created_at?: string
          created_by?: string
        }
      }
      races: {
        Row: {
          id: string
          tournament_id: string
          race_number: number
          race_name: string
          post_time: string
          track: string
        }
        Insert: {
          id?: string
          tournament_id: string
          race_number: number
          race_name: string
          post_time: string
          track: string
        }
        Update: {
          id?: string
          tournament_id?: string
          race_number?: number
          race_name?: string
          post_time?: string
          track?: string
        }
      }
      horses: {
        Row: {
          id: string
          race_id: string
          horse_number: number
          horse_name: string
          jockey: string
          trainer: string
          morning_line_odds: number
          virtual_cost: number
        }
        Insert: {
          id?: string
          race_id: string
          horse_number: number
          horse_name: string
          jockey: string
          trainer: string
          morning_line_odds: number
          virtual_cost: number
        }
        Update: {
          id?: string
          race_id?: string
          horse_number?: number
          horse_name?: string
          jockey?: string
          trainer?: string
          morning_line_odds?: number
          virtual_cost?: number
        }
      }
      entries: {
        Row: {
          id: string
          tournament_id: string
          user_id: string
          stud_name: string
          total_cost: number
          created_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          user_id: string
          stud_name: string
          total_cost: number
          created_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          user_id?: string
          stud_name?: string
          total_cost?: number
          created_at?: string
        }
      }
      entry_horses: {
        Row: {
          id: string
          entry_id: string
          horse_id: string
        }
        Insert: {
          id?: string
          entry_id: string
          horse_id: string
        }
        Update: {
          id?: string
          entry_id?: string
          horse_id?: string
        }
      }
      results: {
        Row: {
          id: string
          race_id: string
          first_place_horses: number[]
          second_place_horses: number[]
          third_place_horses: number[]
          updated_at: string
        }
        Insert: {
          id?: string
          race_id: string
          first_place_horses: number[]
          second_place_horses: number[]
          third_place_horses: number[]
          updated_at?: string
        }
        Update: {
          id?: string
          race_id?: string
          first_place_horses?: number[]
          second_place_horses?: number[]
          third_place_horses?: number[]
          updated_at?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          tournament_id: string
          user_id: string
          entry_id: string
          total_points: number
          updated_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          user_id: string
          entry_id: string
          total_points: number
          updated_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          user_id?: string
          entry_id?: string
          total_points?: number
          updated_at?: string
        }
      }
    }
  }
}
