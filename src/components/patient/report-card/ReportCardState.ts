// Utility to manage report card states
export type ReportCardState = {
  reportStatus: 'pending' | 'in_progress' | 'completed';
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
};

const REPORT_CARD_STATE_KEY = 'reportCardStates';

export const getReportCardState = (scriptId: string): ReportCardState => {
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  if (savedStates) {
    const states = JSON.parse(savedStates);
    // Clean up any potential duplicate states
    const uniqueStates = Object.entries(states).reduce((acc, [key, value]) => {
      if (!acc[key]) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, ReportCardState>);
    
    return uniqueStates[scriptId] || {
      reportStatus: 'pending',
      isDesignInfoComplete: false,
      isClinicalInfoComplete: false
    };
  }
  return {
    reportStatus: 'pending',
    isDesignInfoComplete: false,
    isClinicalInfoComplete: false
  };
};

export const saveReportCardState = (scriptId: string, state: ReportCardState) => {
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  const states = savedStates ? JSON.parse(savedStates) : {};
  
  // Ensure we're not creating duplicates
  states[scriptId] = state;
  
  // Clean up any potential duplicate states
  const uniqueStates = Object.entries(states).reduce((acc, [key, value]) => {
    if (!acc[key]) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, ReportCardState>);
  
  localStorage.setItem(REPORT_CARD_STATE_KEY, JSON.stringify(uniqueStates));
};

// Clean up any existing duplicates
const cleanupReportCardStates = () => {
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  if (savedStates) {
    const states = JSON.parse(savedStates);
    const uniqueStates = Object.entries(states).reduce((acc, [key, value]) => {
      if (!acc[key]) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, ReportCardState>);
    localStorage.setItem(REPORT_CARD_STATE_KEY, JSON.stringify(uniqueStates));
  }
};

// Run cleanup on module load
cleanupReportCardStates();