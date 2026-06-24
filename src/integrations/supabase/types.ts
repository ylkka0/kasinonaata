export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          content: string
          content_en: string | null
          created_at: string
          display_order: number
          id: string
          name: string
          photo_url: string | null
          published: boolean
          role: string | null
          role_en: string | null
          slug: string
          tagline: string | null
          tagline_en: string | null
          updated_at: string
        }
        Insert: {
          content?: string
          content_en?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
          role_en?: string | null
          slug: string
          tagline?: string | null
          tagline_en?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_en?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          photo_url?: string | null
          published?: boolean
          role?: string | null
          role_en?: string | null
          slug?: string
          tagline?: string | null
          tagline_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          content_en: string | null
          cover_image_alt: string | null
          cover_image_alt_en: string | null
          cover_image_url: string | null
          created_at: string
          display_order: number
          excerpt: string | null
          excerpt_en: string | null
          id: string
          meta_description: string | null
          meta_description_en: string | null
          meta_title: string | null
          meta_title_en: string | null
          published: boolean
          published_at: string | null
          slug: string
          tags: string[]
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          author?: string
          content?: string
          content_en?: string | null
          cover_image_alt?: string | null
          cover_image_alt_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[]
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          content_en?: string | null
          cover_image_alt?: string | null
          cover_image_alt_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          excerpt_en?: string | null
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[]
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bonus_alerts: {
        Row: {
          active: boolean
          affiliate_link: string | null
          casino_id: string | null
          created_at: string
          description: string | null
          description_en: string | null
          expires_at: string | null
          id: string
          title: string
          title_en: string | null
        }
        Insert: {
          active?: boolean
          affiliate_link?: string | null
          casino_id?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          expires_at?: string | null
          id?: string
          title: string
          title_en?: string | null
        }
        Update: {
          active?: boolean
          affiliate_link?: string | null
          casino_id?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          expires_at?: string | null
          id?: string
          title?: string
          title_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bonus_alerts_casino_id_fkey"
            columns: ["casino_id"]
            isOneToOne: false
            referencedRelation: "casinos"
            referencedColumns: ["id"]
          },
        ]
      }
      casino_reviews: {
        Row: {
          cons: string[]
          cons_en: string[] | null
          created_at: string
          display_order: number
          extras: Json
          extras_en: Json | null
          games: string
          games_en: string | null
          id: string
          license: string
          license_flag: string
          license_group: string
          license_tax_note: string | null
          logo_url: string | null
          name: string
          payment_methods: string
          payment_methods_en: string | null
          pros: string[]
          pros_en: string[] | null
          published: boolean
          slug: string
          support: string
          support_en: string | null
          title: string
          title_en: string | null
          updated_at: string
          welcome_bonus: string
          welcome_bonus_en: string | null
          withdrawals: string
          withdrawals_en: string | null
        }
        Insert: {
          cons?: string[]
          cons_en?: string[] | null
          created_at?: string
          display_order?: number
          extras?: Json
          extras_en?: Json | null
          games?: string
          games_en?: string | null
          id?: string
          license?: string
          license_flag?: string
          license_group?: string
          license_tax_note?: string | null
          logo_url?: string | null
          name: string
          payment_methods?: string
          payment_methods_en?: string | null
          pros?: string[]
          pros_en?: string[] | null
          published?: boolean
          slug: string
          support?: string
          support_en?: string | null
          title: string
          title_en?: string | null
          updated_at?: string
          welcome_bonus?: string
          welcome_bonus_en?: string | null
          withdrawals?: string
          withdrawals_en?: string | null
        }
        Update: {
          cons?: string[]
          cons_en?: string[] | null
          created_at?: string
          display_order?: number
          extras?: Json
          extras_en?: Json | null
          games?: string
          games_en?: string | null
          id?: string
          license?: string
          license_flag?: string
          license_group?: string
          license_tax_note?: string | null
          logo_url?: string | null
          name?: string
          payment_methods?: string
          payment_methods_en?: string | null
          pros?: string[]
          pros_en?: string[] | null
          published?: boolean
          slug?: string
          support?: string
          support_en?: string | null
          title?: string
          title_en?: string | null
          updated_at?: string
          welcome_bonus?: string
          welcome_bonus_en?: string | null
          withdrawals?: string
          withdrawals_en?: string | null
        }
        Relationships: []
      }
      casinos: {
        Row: {
          affiliate_link: string | null
          avg_withdrawal_minutes: number | null
          bonus_text: string | null
          bonus_text_en: string | null
          cons: string[]
          cons_en: string[] | null
          created_at: string
          fastest_method: string | null
          fastest_withdrawal_minutes: number | null
          featured: boolean
          focus_keyword: string | null
          game_providers: string[]
          id: string
          logo_alt: string | null
          logo_alt_en: string | null
          logo_url: string | null
          meta_description: string | null
          meta_description_en: string | null
          meta_title: string | null
          meta_title_en: string | null
          name: string
          payment_methods: string[]
          pros: string[]
          pros_en: string[] | null
          ranking: number
          rating: number
          review_text: string | null
          review_text_en: string | null
          slug: string
          speed_updated_at: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          affiliate_link?: string | null
          avg_withdrawal_minutes?: number | null
          bonus_text?: string | null
          bonus_text_en?: string | null
          cons?: string[]
          cons_en?: string[] | null
          created_at?: string
          fastest_method?: string | null
          fastest_withdrawal_minutes?: number | null
          featured?: boolean
          focus_keyword?: string | null
          game_providers?: string[]
          id?: string
          logo_alt?: string | null
          logo_alt_en?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          name: string
          payment_methods?: string[]
          pros?: string[]
          pros_en?: string[] | null
          ranking?: number
          rating?: number
          review_text?: string | null
          review_text_en?: string | null
          slug: string
          speed_updated_at?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          affiliate_link?: string | null
          avg_withdrawal_minutes?: number | null
          bonus_text?: string | null
          bonus_text_en?: string | null
          cons?: string[]
          cons_en?: string[] | null
          created_at?: string
          fastest_method?: string | null
          fastest_withdrawal_minutes?: number | null
          featured?: boolean
          focus_keyword?: string | null
          game_providers?: string[]
          id?: string
          logo_alt?: string | null
          logo_alt_en?: string | null
          logo_url?: string | null
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          name?: string
          payment_methods?: string[]
          pros?: string[]
          pros_en?: string[] | null
          ranking?: number
          rating?: number
          review_text?: string | null
          review_text_en?: string | null
          slug?: string
          speed_updated_at?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          amount_eur: number | null
          casino_name: string
          created_at: string
          description: string
          display_name: string
          email: string
          id: string
          is_public: boolean
          issue_type: Database["public"]["Enums"]["complaint_issue"]
          resolution_notes: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          updated_at: string
        }
        Insert: {
          amount_eur?: number | null
          casino_name: string
          created_at?: string
          description: string
          display_name: string
          email: string
          id?: string
          is_public?: boolean
          issue_type: Database["public"]["Enums"]["complaint_issue"]
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
        }
        Update: {
          amount_eur?: number | null
          casino_name?: string
          created_at?: string
          description?: string
          display_name?: string
          email?: string
          id?: string
          is_public?: boolean
          issue_type?: Database["public"]["Enums"]["complaint_issue"]
          resolution_notes?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          answer_en: string | null
          created_at: string
          display_order: number
          id: string
          page_key: string
          published: boolean
          question: string
          question_en: string | null
          updated_at: string
        }
        Insert: {
          answer?: string
          answer_en?: string | null
          created_at?: string
          display_order?: number
          id?: string
          page_key: string
          published?: boolean
          question: string
          question_en?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          answer_en?: string | null
          created_at?: string
          display_order?: number
          id?: string
          page_key?: string
          published?: boolean
          question?: string
          question_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          content_en: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_description_en: string | null
          meta_title: string | null
          meta_title_en: string | null
          slug: string
          title: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          content?: string
          content_en?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          slug: string
          title: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_en?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_description_en?: string | null
          meta_title?: string | null
          meta_title_en?: string | null
          slug?: string
          title?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_reports: {
        Row: {
          amount_range: string
          approved: boolean
          casino_id: string | null
          casino_name: string
          created_at: string
          id: string
          payment_method: string
          player_location: string | null
          withdrawal_minutes: number
        }
        Insert: {
          amount_range: string
          approved?: boolean
          casino_id?: string | null
          casino_name: string
          created_at?: string
          id?: string
          payment_method: string
          player_location?: string | null
          withdrawal_minutes: number
        }
        Update: {
          amount_range?: string
          approved?: boolean
          casino_id?: string | null
          casino_name?: string
          created_at?: string
          id?: string
          payment_method?: string
          player_location?: string | null
          withdrawal_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_reports_casino_id_fkey"
            columns: ["casino_id"]
            isOneToOne: false
            referencedRelation: "casinos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      complaint_issue:
        | "no_payment"
        | "account_closed"
        | "bonus_issue"
        | "technical"
        | "other"
      complaint_status:
        | "pending"
        | "in_progress"
        | "resolved"
        | "rejected"
        | "unresolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      complaint_issue: [
        "no_payment",
        "account_closed",
        "bonus_issue",
        "technical",
        "other",
      ],
      complaint_status: [
        "pending",
        "in_progress",
        "resolved",
        "rejected",
        "unresolved",
      ],
    },
  },
} as const
