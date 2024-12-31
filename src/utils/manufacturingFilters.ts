import { LabScript } from "@/types/labScript";

export const filterManufacturingScripts = (scripts: LabScript[], filter: string) => {
  return scripts.filter(script => {
    const manufacturingLog = script.manufacturingLogs?.[0];
    if (!manufacturingLog) return filter.toLowerCase() === 'ready for printing';

    const { 
      manufacturing_status,
      miyo_status,
      inspection_status,
      inspection_hold_reason 
    } = manufacturingLog;

    switch (filter.toLowerCase()) {
      case 'ready for printing':
        return manufacturing_status === 'pending';
      case 'in_progress':
        // Temporarily returning false for all items in the "in progress" filter
        return false;
      case 'printing':
        return manufacturing_status === 'in_progress' && script.manufacturingType === 'Printing';
      case 'milling':
        return manufacturing_status === 'in_progress' && script.manufacturingType === 'Milling';
      case 'miyo':
        return manufacturing_status === 'completed' && miyo_status !== 'completed';
      case 'inspection':
        return miyo_status === 'completed' && inspection_status !== 'completed' && inspection_status !== 'on_hold';
      case 'completed':
        return inspection_status === 'completed';
      case 'rejected':
        return inspection_status === 'on_hold' && !!inspection_hold_reason;
      default:
        return true;
    }
  });
};