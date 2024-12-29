import React, { useState } from "react";
import { ReportStatusCards } from "@/components/reports/ReportStatusCards";
import ReportCardList from "@/components/reports/ReportCardList";

const Reports = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <ReportStatusCards
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      <ReportCardList filter={activeFilter} />
    </div>
  );
};

export default Reports;