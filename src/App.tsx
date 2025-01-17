import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Marketing from "@/pages/Marketing";
import Leads from "@/pages/Leads";
import PatientProfile from "@/pages/PatientProfile";
import Login from "@/pages/Login";
import Scripts from "@/pages/Scripts";
import Manufacturing from "@/pages/Manufacturing";
import Reports from "@/pages/Reports";
import Consultations from "@/pages/Consultations";
import Calendar from "@/pages/Calendar";
import Inventory from "@/pages/Inventory";
import InventoryItems from "@/pages/inventory/InventoryItems";
import StockManagement from "@/pages/inventory/StockManagement";
import StockMovements from "@/pages/inventory/StockMovements";
import Suppliers from "@/pages/inventory/Suppliers";
import PurchaseOrders from "@/pages/inventory/PurchaseOrders";
import CreatePurchaseOrder from "@/pages/inventory/CreatePurchaseOrder";
import Admin from "@/pages/Admin";

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const session = useSession();
  console.log("Protected route - session:", session);

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['userRole', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role;
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`User does not have required role ${requiredRole}, redirecting to dashboard`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketing"
                  element={
                    <ProtectedRoute>
                      <Marketing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leads"
                  element={
                    <ProtectedRoute>
                      <Leads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultations"
                  element={
                    <ProtectedRoute>
                      <Consultations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patients"
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/:id"
                  element={
                    <ProtectedRoute>
                      <PatientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scripts"
                  element={
                    <ProtectedRoute>
                      <Scripts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manufacturing"
                  element={
                    <ProtectedRoute>
                      <Manufacturing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/items"
                  element={
                    <ProtectedRoute>
                      <InventoryItems />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/stock"
                  element={
                    <ProtectedRoute>
                      <StockManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/movements"
                  element={
                    <ProtectedRoute>
                      <StockMovements />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/suppliers"
                  element={
                    <ProtectedRoute>
                      <Suppliers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/purchase-orders"
                  element={
                    <ProtectedRoute>
                      <PurchaseOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory/purchase-orders/create"
                  element={
                    <ProtectedRoute>
                      <CreatePurchaseOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </SessionContextProvider>
    </React.StrictMode>
  );
}

export default App;
