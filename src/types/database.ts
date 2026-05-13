// ============================================================
// Supabase database table types
// ============================================================

export interface AuditRow {
  id: string;
  created_at: string;
  team_size: number;
  use_case: string;
  tools_json: string; // JSONB stored as string
  recommendations_json: string; // JSONB stored as string
  total_spend: number;
  total_savings: number;
  ai_summary: string | null;
}

export interface LeadRow {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      audits: {
        Row: AuditRow;
        Insert: Omit<AuditRow, 'created_at'> & { created_at?: string };
        Update: Partial<AuditRow>;
      };
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, 'id' | 'created_at'>;
        Update: Partial<LeadRow>;
      };
    };
  };
}
