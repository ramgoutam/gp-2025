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
import PostSurgeryTracking from "@/pages/inventory/PostSurgeryTracking";
import Admin from "@/pages/Admin";

type UserRole = "ADMIN" | "MANAGER_CLINICAL" | "DOCTOR" | "CLINICAL_STAFF" | "LAB_MANAGER" | "LAB_STAFF" | "FRONT_DESK";

const ProtectedRoute = ({
  children,
  requiredRole,
  allowedRoles
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}) => {
  const session = useSession();

  // First, check if we have a session
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Only fetch the role if we need to check roles
  const shouldCheckRole = Boolean(requiredRole || (allowedRoles && allowedRoles.length > 0));

  const {
    data: userRole,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userRole', session.user.id],
    queryFn: async () => {
      if (!shouldCheckRole) return null;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (error) throw error;
        return data?.role as UserRole | null;
      } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
      }
    },
    enabled: Boolean(session.user.id && shouldCheckRole),
    staleTime: 30000, // Cache the result for 30 seconds
    cacheTime: 60000, // Keep in cache for 1 minute
    retry: 1
  });

  // If we don't need to check roles, render the children
  if (!shouldCheckRole) {
    return <>{children}</>;
  }

  // If we're loading the role and need to check it, show loading
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Check role requirements
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    return <Navigate to="/" replace />;
  }

  // If we reach here, the user has the required role
  return <>{children}</>;
};

function App() {
  return (
    <React.StrictMode>
      <SessionContextProvider supabaseClient={supabase} initialSession={null}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="container mx-auto h-[calc(100vh-4rem)] overflow-hidden px-0">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/marketing" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}><Marketing /></ProtectedRoute>} />
                <Route path="/leads" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}><Leads /></ProtectedRoute>} />
                <Route path="/consultations" element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}><Consultations /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/patient/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
                <Route path="/scripts" element={<ProtectedRoute><Scripts /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/manufacturing" element={<ProtectedRoute><Manufacturing /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/inventory/items" element={<ProtectedRoute><InventoryItems /></ProtectedRoute>} />
                <Route path="/inventory/stock" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
                <Route path="/inventory/movements" element={<ProtectedRoute><StockMovements /></ProtectedRoute>} />
                <Route path="/inventory/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                <Route path="/inventory/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
                <Route path="/inventory/purchase-orders/create" element={<ProtectedRoute><CreatePurchaseOrder /></ProtectedRoute>} />
                <Route path="/inventory/post-surgery-tracking" element={<ProtectedRoute><PostSurgeryTracking /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Admin /></ProtectedRoute>} />
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
