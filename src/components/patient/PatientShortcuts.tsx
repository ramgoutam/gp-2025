import { Link } from "react-router-dom";
import { 
  FileText, 
  ClipboardList, 
  Stethoscope, 
  Calendar, 
  FileCheck,
  Activity,
  History,
  ScrollText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShortcutProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const Shortcut = ({ icon, label, onClick }: ShortcutProps) => (
  <Button
    variant="outline"
    className="flex flex-col items-center gap-2 p-4 h-auto hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
    onClick={onClick}
  >
    <div className="p-2 rounded-lg bg-primary/10 text-primary">
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-600">{label}</span>
  </Button>
);

interface PatientShortcutsProps {
  onTabChange: (tab: string) => void;
}

export const PatientShortcuts = ({ onTabChange }: PatientShortcutsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <Shortcut
        icon={<FileText className="w-5 h-5" />}
        label="Patient Info"
        onClick={() => onTabChange("patient-information")}
      />
      <Shortcut
        icon={<ClipboardList className="w-5 h-5" />}
        label="Lab Scripts"
        onClick={() => onTabChange("lab-scripts")}
      />
      <Shortcut
        icon={<Stethoscope className="w-5 h-5" />}
        label="Treatment Status"
        onClick={() => onTabChange("treatment-status")}
      />
      <Shortcut
        icon={<Calendar className="w-5 h-5" />}
        label="Appointments"
        onClick={() => onTabChange("appointment-history")}
      />
      <Shortcut
        icon={<FileCheck className="w-5 h-5" />}
        label="Report Cards"
        onClick={() => onTabChange("report-card")}
      />
      <Shortcut
        icon={<Activity className="w-5 h-5" />}
        label="Next Treatment"
        onClick={() => onTabChange("next-treatment")}
      />
      <Shortcut
        icon={<History className="w-5 h-5" />}
        label="Medical Record"
        onClick={() => onTabChange("medical-record")}
      />
      <Shortcut
        icon={<ScrollText className="w-5 h-5" />}
        label="Medical Forms"
        onClick={() => onTabChange("medical-forms")}
      />
    </div>
  );
};