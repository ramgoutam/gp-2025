import { Navigation } from "@/components/Navigation";
import { PatientForm } from "@/components/PatientForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Patient Registration</h1>
        <PatientForm />
      </main>
    </div>
  );
};

export default Index;