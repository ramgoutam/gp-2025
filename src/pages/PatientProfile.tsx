import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

const PatientProfile = () => {
  const { id } = useParams();
  
  // This would typically fetch patient data from an API
  // For now we'll just display the ID
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Patient ID: {id}</p>
          {/* Additional patient details would go here */}
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;