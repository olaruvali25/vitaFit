export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          phone: string | null
          phone_verified: boolean
          plan: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit: number
          created_at: string
          has_used_free_trial: boolean
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          phone_verified?: boolean
          plan?: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit?: number
          created_at?: string
          has_used_free_trial?: boolean
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          phone_verified?: boolean
          plan?: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit?: number
          created_at?: string
          has_used_free_trial?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      app_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          profile_picture: string | null
          age: number | null
          gender: string | null
          height_cm: number | null
          weight_kg: number | null
          goal: string | null
          goal_weight: number | null
          activity_level: string | null
          timeline: string | null
          dietary_restrictions: string | null
          workout_days: string | null
          workout_duration: string | null
          meal_prep_duration: string | null
          created_at: string
          updated_at: string
          is_main_profile: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          profile_picture?: string | null
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          goal?: string | null
          goal_weight?: number | null
          activity_level?: string | null
          timeline?: string | null
          dietary_restrictions?: string | null
          workout_days?: string | null
          workout_duration?: string | null
          meal_prep_duration?: string | null
          created_at?: string
          updated_at?: string
          is_main_profile?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          profile_picture?: string | null
          age?: number | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          goal?: string | null
          goal_weight?: number | null
          activity_level?: string | null
          timeline?: string | null
          dietary_restrictions?: string | null
          workout_days?: string | null
          workout_duration?: string | null
          meal_prep_duration?: string | null
          created_at?: string
          updated_at?: string
          is_main_profile?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "app_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          status: 'active' | 'canceled' | 'past_due' | 'expired'
          created_at: string
          trial_started_at: string | null
          trial_ends_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          status?: 'active' | 'canceled' | 'past_due' | 'expired'
          created_at?: string
          trial_started_at?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
          status?: 'active' | 'canceled' | 'past_due' | 'expired'
          created_at?: string
          trial_started_at?: string | null
          trial_ends_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_type: 'none' | 'free trial' | 'pro' | 'plus' | 'family'
      subscription_status: 'active' | 'canceled' | 'past_due' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
