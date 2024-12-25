import { BrowserRouter as Router } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientProfile from './pages/PatientProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;