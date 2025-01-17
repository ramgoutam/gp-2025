import React, { useState } from 'react';
import { Shield, UserCheck, UserX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: userRoles, isLoading, refetch } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      return roles;
    },
  });

  const handleRoleToggle = async (userId: string, currentRole: "ADMIN" | "MANAGER_CLINICAL" | "DOCTOR" | "CLINICAL_STAFF" | "LAB_MANAGER" | "LAB_STAFF" | "FRONT_DESK") => {
    // For now, we'll just toggle between ADMIN and CLINICAL_STAFF as an example
    const newRole = currentRole === 'ADMIN' ? 'CLINICAL_STAFF' : 'ADMIN';
    
    const { error } = await supabase
      .from('user_roles')
      .upsert({ 
        user_id: userId, 
        role: newRole 
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `User role updated to ${newRole}`,
    });
    refetch();
  };

  const filteredRoles = userRoles?.filter(role => 
    role.user_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 lg:col-span-2">
          <h3 className="font-semibold mb-2">User Management</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage user roles and permissions</p>
          
          <div className="space-y-4">
            <Input
              placeholder="Search users..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">Loading users...</TableCell>
                    </TableRow>
                  ) : filteredRoles?.map((userRole) => (
                    <TableRow key={userRole.id}>
                      <TableCell>{userRole.user_id}</TableCell>
                      <TableCell>{userRole.role}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleToggle(userRole.user_id!, userRole.role)}
                        >
                          {userRole.role === 'ADMIN' ? (
                            <UserX className="h-4 w-4 mr-2" />
                          ) : (
                            <UserCheck className="h-4 w-4 mr-2" />
                          )}
                          {userRole.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold mb-2">System Settings</h3>
          <p className="text-sm text-muted-foreground">Configure system-wide settings</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;