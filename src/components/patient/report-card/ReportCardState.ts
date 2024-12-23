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
    return states[scriptId] || {
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
  states[scriptId] = state;
  localStorage.setItem(REPORT_CARD_STATE_KEY, JSON.stringify(states));
};