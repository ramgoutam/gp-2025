import React from "react";
import { Loader } from "lucide-react";

export const LoadingPatient = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 text-primary animate-spin" />
        <p className="text-gray-600">Loading patient data...</p>
      </div>
    </div>
  );
};