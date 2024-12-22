import React, { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useLocation } from "react-router-dom";
import { LabScriptDetails } from "@/components/patient/LabScriptDetails";
import { demoLabScripts } from "@/utils/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lab Scripts</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {demoLabScripts.map((script) => (
              <Card
                key={script.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setScriptData(script);
                  setShowDetails(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">
                        {script.patientFirstName} {script.patientLastName}
                      </h3>
                      <Badge
                        className={`${getStatusColor(script.status)} border-none`}
                      >
                        {script.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {script.applianceType}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {script.doctorName} - {script.clinicName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      Due: {new Date(script.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
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