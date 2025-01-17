import React from 'react';
import { Shield } from 'lucide-react';

const Admin = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage system settings and user access
          </p>
        </div>
        <Shield className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for admin features */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold mb-2">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold mb-2">System Settings</h3>
          <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold mb-2">Audit Logs</h3>
          <p className="text-sm text-muted-foreground">View system activity and changes</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;