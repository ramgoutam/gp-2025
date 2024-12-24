// Utility to manage report card states
export type ReportCardState = {
  reportStatus: 'pending' | 'in_progress' | 'completed';
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
};

const REPORT_CARD_STATE_KEY = 'reportCardStates';

const defaultState: ReportCardState = {
  reportStatus: 'pending',
  isDesignInfoComplete: false,
  isClinicalInfoComplete: false
};

export const getReportCardState = (scriptId: string): ReportCardState => {
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  if (savedStates) {
    const states = JSON.parse(savedStates);
    // Clean up any potential duplicate states
    const uniqueStates = Object.entries(states).reduce((acc, [key, value]) => {
      if (!acc[key]) {
        // Ensure all required properties are present
        acc[key] = {
          ...defaultState,
          ...value as ReportCardState
        };
      }
      return acc;
    }, {} as Record<string, ReportCardState>);
    
    return uniqueStates[scriptId] || defaultState;
  }
  return defaultState;
};

export const saveReportCardState = (scriptId: string, state: ReportCardState) => {
  console.log("Saving report card state for script:", scriptId, state);
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  const states = savedStates ? JSON.parse(savedStates) : {};
  
  // Ensure we're not creating duplicates and all properties are present
  states[scriptId] = {
    ...defaultState,
    ...state
  };
  
  // Clean up any potential duplicate states
  const uniqueStates = Object.entries(states).reduce((acc, [key, value]) => {
    if (!acc[key]) {
      acc[key] = {
        ...defaultState,
        ...value as ReportCardState
      };
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
        acc[key] = {
          ...defaultState,
          ...value as ReportCardState
        };
      }
      return acc;
    }, {} as Record<string, ReportCardState>);
    localStorage.setItem(REPORT_CARD_STATE_KEY, JSON.stringify(uniqueStates));
  }
};

// Run cleanup on module load
cleanupReportCardStates();