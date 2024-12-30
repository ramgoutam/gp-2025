import { ReportCardState, InfoStatus, DesignInfo, ClinicalInfo } from "@/types/reportCard";

const REPORT_CARD_STATE_KEY = 'reportCardStates';

const defaultState: ReportCardState = {
  reportStatus: 'pending',
  isDesignInfoComplete: false,
  isClinicalInfoComplete: false,
  designInfo: undefined,
  clinicalInfo: undefined
};

export const getReportCardState = (scriptId: string): ReportCardState => {
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
    
    return uniqueStates[scriptId] || defaultState;
  }
  return defaultState;
};

export const saveReportCardState = (scriptId: string, state: ReportCardState) => {
  console.log("Saving report card state for script:", scriptId, state);
  const savedStates = localStorage.getItem(REPORT_CARD_STATE_KEY);
  const states = savedStates ? JSON.parse(savedStates) : {};
  
  states[scriptId] = {
    ...defaultState,
    ...state
  };
  
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

export const updateDesignInfo = (state: ReportCardState, designInfo?: DesignInfo): ReportCardState => {
  if (designInfo) {
    return {
      ...state,
      designInfo,
      isDesignInfoComplete: true
    };
  }
  return state;
};

export const updateClinicalInfo = (state: ReportCardState, clinicalInfo?: ClinicalInfo): ReportCardState => {
  if (clinicalInfo) {
    return {
      ...state,
      clinicalInfo,
      isClinicalInfoComplete: true
    };
  }
  return state;
};

export const cleanupReportCardStates = () => {
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

cleanupReportCardStates();