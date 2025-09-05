export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      analyses: {
        Row: {
          id: string;
          resume_id: string;
          user_id: string;
          analysis_type: string;
          analysis_data: Json;
          recommendations: string[] | null;
          strengths: string[] | null;
          weaknesses: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          user_id: string;
          analysis_type: string;
          analysis_data: Json;
          recommendations?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          user_id?: string;
          analysis_type?: string;
          analysis_data?: Json;
          recommendations?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_size: number | null;
          file_type: string | null;
          content: string;
          analysis: Json | null;
          score: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          file_size?: number | null;
          file_type?: string | null;
          content: string;
          analysis?: Json | null;
          score?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_size?: number | null;
          file_type?: string | null;
          content?: string;
          analysis?: Json | null;
          score?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          currency: string;
          status: string;
          payment_reference: string | null;
          paystack_subscription_code: string | null;
          starts_at: string;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          amount: number;
          currency?: string;
          status?: string;
          payment_reference?: string | null;
          paystack_subscription_code?: string | null;
          starts_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          plan_name?: string;
          amount?: number;
          currency?: string;
          status?: string;
          payment_reference?: string | null;
          paystack_subscription_code?: string | null;
          starts_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          subscription_tier: string;
          subscription_status: string;
          subscription_expires_at: string | null;
          resume_analyses_used: number;
          resume_analyses_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          subscription_expires_at?: string | null;
          resume_analyses_used?: number;
          resume_analyses_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          subscription_expires_at?: string | null;
          resume_analyses_used?: number;
          resume_analyses_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      whatsapp_sessions: {
        Row: {
          id: string;
          user_id: string | null;
          phone_number: string;
          session_data: Json | null;
          status: string;
          last_activity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          phone_number: string;
          session_data?: Json | null;
          status?: string;
          last_activity?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          phone_number?: string;
          session_data?: Json | null;
          status?: string;
          last_activity?: string;
          created_at?: string;
        };
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}
