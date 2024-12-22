import React, { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";

const Scripts = () => {
  const location = useLocation();
  const [showDetails, setShowDetails] = React.useState(false);
  const [scriptData, setScriptData] = React.useState(null);

  useEffect(() => {
    if (location.state?.openScript) {
      console.log("Opening script details:", location.state.openScript);
      setScriptData(location.state.openScript);
      setShowDetails(true);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lab Scripts</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Lab scripts management coming soon...</p>
        </div>

        <LabScriptDetails
          script={scriptData}
          open={showDetails}
          onOpenChange={setShowDetails}
          onEdit={() => {}}
        />
      </main>
    </div>
  );
};

export default Scripts;