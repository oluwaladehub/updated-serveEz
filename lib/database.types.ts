export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          location: string;
          project_type: string | null;
          estimated_value: string | null;
          currency: string;
          status: 'pending' | 'active' | 'completed' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          location: string;
          project_type?: string | null;
          estimated_value?: string | null;
          currency?: string;
          status?: 'pending' | 'active' | 'completed' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          location?: string;
          project_type?: string | null;
          estimated_value?: string | null;
          currency?: string;
          status?: 'pending' | 'active' | 'completed' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };

      verification_requests: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          request_notes: string | null;
          admin_notes: string | null;
          scheduled_date: string | null;
          completed_date: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          request_notes?: string | null;
          admin_notes?: string | null;
          scheduled_date?: string | null;
          completed_date?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          request_notes?: string | null;
          admin_notes?: string | null;
          scheduled_date?: string | null;
          completed_date?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      verification_media: {
        Row: {
          id: string;
          verification_request_id: string;
          file_path: string;
          file_name: string;
          file_type: 'image' | 'video' | 'audio';
          file_size: number | null;
          caption: string | null;
          metadata: Json | null;
          visibility: 'visible' | 'hidden' | 'featured';
          uploaded_by_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          verification_request_id: string;
          file_path: string;
          file_name: string;
          file_type: 'image' | 'video' | 'audio';
          file_size?: number | null;
          caption?: string | null;
          metadata?: Json | null;
          visibility?: 'visible' | 'hidden' | 'featured';
          uploaded_by_admin?: boolean;
          created_at?: string;
        };
        Update: {
          file_path?: string;
          file_name?: string;
          file_type?: 'image' | 'video' | 'audio';
          file_size?: number | null;
          caption?: string | null;
          metadata?: Json | null;
          visibility?: 'visible' | 'hidden' | 'featured';
          uploaded_by_admin?: boolean;
          created_at?: string;
        };
      };

      verification_media_tags: {
        Row: {
          id: string;
          media_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          media_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          media_id?: string;
          tag?: string;
          created_at?: string;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          read: boolean;
          related_id: string | null;
          related_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          read?: boolean;
          related_id?: string | null;
          related_type?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
