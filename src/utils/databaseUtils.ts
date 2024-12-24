import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type LabScript = Database['public']['Tables']['lab_scripts']['Row'];
type LabScriptInsert = Database['public']['Tables']['lab_scripts']['Insert'];
type ReportCard = Database['public']['Tables']['report_cards']['Row'];
type ReportCardInsert = Database['public']['Tables']['report_cards']['Insert'];

export const generateRequestNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LAB-${timestamp}-${random}`;
};

export const saveLabScript = async (script: LabScriptInsert): Promise<LabScript | null> => {
  console.log('Saving lab script:', script);
  const { data, error } = await supabase
    .from('lab_scripts')
    .insert([{
      ...script,
      request_number: generateRequestNumber(),
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving lab script:', error);
    throw error;
  }

  return data;
};

export const updateLabScript = async (script: LabScript): Promise<LabScript | null> => {
  console.log('Updating lab script:', script);
  const { data, error } = await supabase
    .from('lab_scripts')
    .update(script)
    .eq('id', script.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lab script:', error);
    throw error;
  }

  return data;
};

export const getLabScripts = async (): Promise<LabScript[]> => {
  console.log('Fetching lab scripts');
  const { data, error } = await supabase
    .from('lab_scripts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lab scripts:', error);
    throw error;
  }

  return data || [];
};

export const deleteLabScript = async (id: string): Promise<void> => {
  console.log('Deleting lab script:', id);
  const { error } = await supabase
    .from('lab_scripts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lab script:', error);
    throw error;
  }
};

export const saveReportCard = async (reportCard: ReportCardInsert): Promise<ReportCard | null> => {
  console.log('Saving report card:', reportCard);
  const { data, error } = await supabase
    .from('report_cards')
    .insert([reportCard])
    .select()
    .single();

  if (error) {
    console.error('Error saving report card:', error);
    throw error;
  }

  return data;
};

export const updateReportCard = async (reportCard: ReportCard): Promise<ReportCard | null> => {
  console.log('Updating report card:', reportCard);
  const { data, error } = await supabase
    .from('report_cards')
    .update(reportCard)
    .eq('id', reportCard.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating report card:', error);
    throw error;
  }

  return data;
};