import { Navigation } from "@/components/Navigation";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>
        {/* We'll implement the reports in the next iteration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Reports dashboard coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Reports;