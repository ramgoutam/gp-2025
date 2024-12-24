import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";

export const PatientSearch = () => {
  const { searchQuery, setSearchQuery } = usePatientStore();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};