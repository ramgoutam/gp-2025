export interface DesignInfo {
  designDate: string;
  applianceType: string;
  upperTreatment: string;
  lowerTreatment: string;
  screw: string;
  implantLibrary: string;
  teethLibrary: string;
  actionsTaken: string;
}

export interface ClinicalInfo {
  insertionDate: string;
  applianceFit: string;
  designFeedback: string;
  occlusion: string;
  esthetics: string;
  adjustmentsMade: string;
  material: string;
  shade: string;
}

export interface ReportCardState {
  reportStatus: string;
  isDesignInfoComplete: boolean;
  isClinicalInfoComplete: boolean;
  designInfo: DesignInfo;
  clinicalInfo: ClinicalInfo;
}