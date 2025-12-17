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
          phone: string
          phone_verified: boolean
          plan: 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          phone: string
          phone_verified?: boolean
          plan?: 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          phone_verified?: boolean
          plan?: 'free trial' | 'pro' | 'plus' | 'family'
          profiles_limit?: number
          created_at?: string
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
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free trial' | 'pro' | 'plus' | 'family'
          status: 'active' | 'canceled' | 'past_due'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'free trial' | 'pro' | 'plus' | 'family'
          status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free trial' | 'pro' | 'plus' | 'family'
          status?: 'active' | 'canceled' | 'past_due'
          created_at?: string
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
      plan_type: 'free trial' | 'pro' | 'plus' | 'family'
      subscription_status: 'active' | 'canceled' | 'past_due'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
