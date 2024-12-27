import React, { useState } from "react";
import { ReportStatusCards } from "@/components/reports/ReportStatusCards";

const Reports = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Report Cards</h1>
      </div>

      <ReportStatusCards
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      {/* Content will be added based on your guidance */}
    </div>
  );
};

export default Reports;