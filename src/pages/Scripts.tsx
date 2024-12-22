import React, { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";
import { demoLabScripts } from "@/utils/demoData";

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
          <div className="space-y-4">
            {demoLabScripts.map((script) => (
              <div 
                key={script.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setScriptData(script);
                  setShowDetails(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{script.applianceType}</h3>
                    <p className="text-sm text-gray-600">
                      Dr. {script.doctorName} - {script.clinicName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Due: {new Date(script.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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