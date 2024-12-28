export interface ManufacturingLog {
  id: string;
  lab_script_id: string;
  manufacturing_status: string;
  sintering_status: string;
  miyo_status: string;
  inspection_status: string;
}

export type StatusMap = Record<string, string>;