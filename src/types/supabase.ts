// src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          price: number
          discounted_price: number | null
          category: string
          condition: string | null
          stock: number | null
          images: string[] | null
          status: string
          created_at: string
          updated_at: string | null
        }
        // Add Insert/Update if needed (optional for Row-only usage)
      }
      orders: {
        Row: {
          id: string
          buyer_id: string | null
          seller_id: string | null
          product_id: string | null
          quantity: number
          total_amount: number
          status: string
          flutterwave_tx_ref: string | null
          payment_status: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string | null
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          flutterwave_tx_ref: string
          amount: number
          status: string
          gateway_response: string | null
          data: Json | null
          created_at: string
        }
      }
    }
  }
}