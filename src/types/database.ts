export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      fragments: {
        Row: {
          id: string;
          type: "text" | "voice" | "image";
          content: string | null;
          audio_url: string | null;
          image_url: string | null;
          tags: string[];
          episode_id: string | null;
          character_id: string | null;
          section: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "text" | "voice" | "image";
          content?: string | null;
          audio_url?: string | null;
          image_url?: string | null;
          tags?: string[];
          episode_id?: string | null;
          character_id?: string | null;
          section?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: "text" | "voice" | "image";
          content?: string | null;
          audio_url?: string | null;
          image_url?: string | null;
          tags?: string[];
          episode_id?: string | null;
          character_id?: string | null;
          section?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      characters: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          details: Json | null;
          notes: string | null;
          element: string | null;
          animal: string | null;
          order_index: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          details?: Json | null;
          notes?: string | null;
          element?: string | null;
          animal?: string | null;
          order_index?: number;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          details?: Json | null;
          notes?: string | null;
          element?: string | null;
          animal?: string | null;
          order_index?: number;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      episodes: {
        Row: {
          id: string;
          number: number;
          title: string | null;
          synopsis: string | null;
          scenes: Json | null;
          dialogues: Json | null;
          progress: number;
          focus_character_id: string | null;
          notes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          number: number;
          title?: string | null;
          synopsis?: string | null;
          scenes?: Json | null;
          dialogues?: Json | null;
          progress?: number;
          focus_character_id?: string | null;
          notes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          number?: number;
          title?: string | null;
          synopsis?: string | null;
          scenes?: Json | null;
          dialogues?: Json | null;
          progress?: number;
          focus_character_id?: string | null;
          notes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      refs: {
        Row: {
          id: string;
          type: string | null;
          url: string | null;
          title: string;
          note: string | null;
          tags: string[];
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type?: string | null;
          url?: string | null;
          title: string;
          note?: string | null;
          tags?: string[];
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string | null;
          url?: string | null;
          title?: string;
          note?: string | null;
          tags?: string[];
          user_id?: string;
          created_at?: string;
        };
      };
      world_items: {
        Row: {
          id: string;
          type: "image" | "music" | "text";
          content: string | null;
          url: string | null;
          note: string | null;
          category: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: "image" | "music" | "text";
          content?: string | null;
          url?: string | null;
          note?: string | null;
          category?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: "image" | "music" | "text";
          content?: string | null;
          url?: string | null;
          note?: string | null;
          category?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      brainstorm_history: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          category?: string | null;
          user_id?: string;
          created_at?: string;
        };
      };
      scratch: {
        Row: {
          id: string;
          content: string;
          moved_to: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          moved_to?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          moved_to?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      fragment_type: "text" | "voice" | "image";
      world_item_type: "image" | "music" | "text";
    };
  };
}

// Convenience types
export type Fragment = Database["public"]["Tables"]["fragments"]["Row"];
export type Character = Database["public"]["Tables"]["characters"]["Row"];
export type Episode = Database["public"]["Tables"]["episodes"]["Row"];
export type Ref = Database["public"]["Tables"]["refs"]["Row"];
export type WorldItem = Database["public"]["Tables"]["world_items"]["Row"];
export type Scratch = Database["public"]["Tables"]["scratch"]["Row"];
