import { Navigation } from "@/components/Navigation";

const Scripts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lab Scripts</h1>
        {/* We'll implement the lab scripts management in the next iteration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Lab scripts management coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Scripts;