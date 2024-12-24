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
      clinical_info: {
        Row: {
          adjustments_made: string | null
          appliance_fit: string | null
          created_at: string
          design_feedback: string | null
          esthetics: string | null
          id: string
          insertion_date: string | null
          material: string | null
          occlusion: string | null
          report_card_id: string | null
          shade: string | null
          updated_at: string
        }
        Insert: {
          adjustments_made?: string | null
          appliance_fit?: string | null
          created_at?: string
          design_feedback?: string | null
          esthetics?: string | null
          id?: string
          insertion_date?: string | null
          material?: string | null
          occlusion?: string | null
          report_card_id?: string | null
          shade?: string | null
          updated_at?: string
        }
        Update: {
          adjustments_made?: string | null
          appliance_fit?: string | null
          created_at?: string
          design_feedback?: string | null
          esthetics?: string | null
          id?: string
          insertion_date?: string | null
          material?: string | null
          occlusion?: string | null
          report_card_id?: string | null
          shade?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_info_report_card_id_fkey"
            columns: ["report_card_id"]
            isOneToOne: false
            referencedRelation: "report_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      design_info: {
        Row: {
          actions_taken: string | null
          appliance_type: string | null
          created_at: string
          design_date: string
          id: string
          implant_library: string | null
          lower_treatment: string | null
          report_card_id: string | null
          screw: string | null
          teeth_library: string | null
          updated_at: string
          upper_treatment: string | null
        }
        Insert: {
          actions_taken?: string | null
          appliance_type?: string | null
          created_at?: string
          design_date?: string
          id?: string
          implant_library?: string | null
          lower_treatment?: string | null
          report_card_id?: string | null
          screw?: string | null
          teeth_library?: string | null
          updated_at?: string
          upper_treatment?: string | null
        }
        Update: {
          actions_taken?: string | null
          appliance_type?: string | null
          created_at?: string
          design_date?: string
          id?: string
          implant_library?: string | null
          lower_treatment?: string | null
          report_card_id?: string | null
          screw?: string | null
          teeth_library?: string | null
          updated_at?: string
          upper_treatment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_info_report_card_id_fkey"
            columns: ["report_card_id"]
            isOneToOne: false
            referencedRelation: "report_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_script_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          lab_script_id: string | null
          upload_type: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          lab_script_id?: string | null
          upload_type: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          lab_script_id?: string | null
          upload_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_script_files_lab_script_id_fkey"
            columns: ["lab_script_id"]
            isOneToOne: false
            referencedRelation: "lab_scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_scripts: {
        Row: {
          appliance_type: string | null
          clinic_name: string
          created_at: string
          doctor_name: string
          due_date: string
          id: string
          lower_design_name: string | null
          lower_treatment: string | null
          patient_id: string
          request_date: string
          request_number: string | null
          screw_type: string | null
          specific_instructions: string | null
          status: string
          updated_at: string
          upper_design_name: string | null
          upper_treatment: string | null
          vdo_option: string | null
        }
        Insert: {
          appliance_type?: string | null
          clinic_name: string
          created_at?: string
          doctor_name: string
          due_date: string
          id?: string
          lower_design_name?: string | null
          lower_treatment?: string | null
          patient_id: string
          request_date: string
          request_number?: string | null
          screw_type?: string | null
          specific_instructions?: string | null
          status?: string
          updated_at?: string
          upper_design_name?: string | null
          upper_treatment?: string | null
          vdo_option?: string | null
        }
        Update: {
          appliance_type?: string | null
          clinic_name?: string
          created_at?: string
          doctor_name?: string
          due_date?: string
          id?: string
          lower_design_name?: string | null
          lower_treatment?: string | null
          patient_id?: string
          request_date?: string
          request_number?: string | null
          screw_type?: string | null
          specific_instructions?: string | null
          status?: string
          updated_at?: string
          upper_design_name?: string | null
          upper_treatment?: string | null
          vdo_option?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_scripts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string
          dob: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          sex: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          dob: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          sex: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          dob?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          sex?: string
          updated_at?: string
        }
        Relationships: []
      }
      report_cards: {
        Row: {
          clinical_info_id: string | null
          clinical_info_status: string
          created_at: string
          design_info_id: string | null
          design_info_status: string
          id: string
          lab_script_id: string | null
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          clinical_info_id?: string | null
          clinical_info_status?: string
          created_at?: string
          design_info_id?: string | null
          design_info_status?: string
          id?: string
          lab_script_id?: string | null
          patient_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          clinical_info_id?: string | null
          clinical_info_status?: string
          created_at?: string
          design_info_id?: string | null
          design_info_status?: string
          id?: string
          lab_script_id?: string | null
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_cards_clinical_info_id_fkey"
            columns: ["clinical_info_id"]
            isOneToOne: false
            referencedRelation: "clinical_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_cards_design_info_id_fkey"
            columns: ["design_info_id"]
            isOneToOne: false
            referencedRelation: "design_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_cards_lab_script_id_fkey"
            columns: ["lab_script_id"]
            isOneToOne: true
            referencedRelation: "lab_scripts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_cards_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
