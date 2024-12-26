import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import PatientProfile from "@/pages/PatientProfile";
import Scripts from "@/pages/Scripts";
import ReportCard from "@/pages/ReportCard";
import Manufacturing from "@/pages/Manufacturing";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={
              <main className="container mx-auto py-8 px-4">
                <Dashboard />
              </main>
            }
          />
          <Route
            path="/patients"
            element={
              <main className="container mx-auto py-8 px-4">
                <Index />
              </main>
            }
          />
          <Route
            path="/patient/:id"
            element={
              <main className="container mx-auto py-8 px-4">
                <PatientProfile />
              </main>
            }
          />
          <Route
            path="/scripts"
            element={
              <main className="container mx-auto py-8 px-4">
                <Scripts />
              </main>
            }
          />
          <Route
            path="/report-card"
            element={
              <main className="container mx-auto py-8 px-4">
                <ReportCard />
              </main>
            }
          />
          <Route
            path="/manufacturing"
            element={
              <main className="container mx-auto py-8 px-4">
                <Manufacturing />
              </main>
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;