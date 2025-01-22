import React, { useState, useEffect } from 'react';
import { Shield, UserX, Pencil, Key, UserCog, UserPen } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PhoneInput } from "@/components/ui/phone-input";
import { DeletePatientDialog } from "@/components/patient/header/DeletePatientDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UserRole = {
  id: string;
  user_id: string;
  role: "ADMIN" | "MANAGER_CLINICAL" | "DOCTOR" | "CLINICAL_STAFF" | "LAB_MANAGER" | "LAB_STAFF" | "FRONT_DESK";
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};

const roles = ["ADMIN", "MANAGER_CLINICAL", "DOCTOR", "CLINICAL_STAFF", "LAB_MANAGER", "LAB_STAFF", "FRONT_DESK"] as const;

const createUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, { 
    message: "Please enter a valid phone number with country code (e.g., +1234567890)" 
  }),
  role: z.enum(roles),
});

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{ userId: string; role: UserRole['role'] } | null>(null);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [editingUserDetails, setEditingUserDetails] = useState<UserRole | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole['role'] | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: "CLINICAL_STAFF",
    },
  });

  const { data: userRoles, isLoading, refetch } = useQuery({
    queryKey: ['userRoles'],
    queryFn: async () => {
      console.log('Fetching user roles...');
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      console.log('Fetched roles:', roles);
      return roles as UserRole[];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { data: currentUserRole } = useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      console.log('Fetching current user role...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      console.log('Current user role:', roles?.role);
      return roles?.role;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  });

  useEffect(() => {
    const fetchUserEmails = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-user-details', {
          body: { cache: true }
        });
        if (error) throw error;
        setUserEmails(data.users);
      } catch (error) {
        console.error('Error fetching user emails:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user emails",
          variant: "destructive",
        });
      }
    };

    fetchUserEmails();
  }, [toast]);

  const handlePasswordChange = async (userId: string) => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('update-user-password', {
        body: { userId, newPassword }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setIsPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      setChangingPasswordFor(null);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: UserRole['role']) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role updated successfully",
      });

      setIsRoleDialogOpen(false);
      setEditingRole(null);
      setSelectedRole(null);
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleImpersonateUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { targetUserId: userId }
      });

      if (error) throw error;

      // Open the magic link in a new tab
      window.open(data.magicLink, '_blank');

      toast({
        title: "Success",
        description: "Impersonation link generated",
      });
    } catch (error) {
      console.error('Error generating impersonation link:', error);
      toast({
        title: "Error",
        description: "Failed to generate impersonation link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Manage system settings and user access
          </p>
        </div>
        <Shield className="h-8 w-8 text-muted-foreground" />
      </div>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter the new password for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setNewPassword('');
                setConfirmPassword('');
                setChangingPasswordFor(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => changingPasswordFor && handlePasswordChange(changingPasswordFor)}
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for this user. Only administrators can perform this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Role</Label>
              <p className="text-sm text-muted-foreground">
                {editingRole?.role || 'No role selected'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">New Role</Label>
              <select
                id="new-role"
                value={selectedRole || editingRole?.role || ''}
                onChange={(e) => setSelectedRole(e.target.value as UserRole['role'])}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={currentUserRole !== 'ADMIN'}
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false);
                setEditingRole(null);
                setSelectedRole(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingRole?.userId && selectedRole) {
                  handleRoleUpdate(editingRole.userId, selectedRole);
                }
              }}
              disabled={!selectedRole || selectedRole === editingRole?.role || currentUserRole !== 'ADMIN'}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-4 p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">User Management</h3>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <UserCog className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user account.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Create User</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-10"
              />
            </div>
          </div>
        </div>

        <div className="border-t">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-muted-foreground">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((userRole) => (
                  <TableRow 
                    key={userRole.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{userEmails[userRole.user_id] || 'Loading...'}</TableCell>
                    <TableCell>{`${userRole.first_name || ''} ${userRole.last_name || ''}`}</TableCell>
                    <TableCell>{userRole.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                        {userRole.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImpersonateUser(userRole.user_id)}
                                className="hover:bg-primary/10"
                              >
                                <UserCog className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Impersonate User</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingUserDetails(userRole);
                                }}
                                className="hover:bg-primary/10"
                              >
                                <UserPen className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit User Details</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsPasswordDialogOpen(true);
                                  setChangingPasswordFor(userRole.user_id);
                                }}
                                className="hover:bg-primary/10"
                              >
                                <Key className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Change Password</p>
                            </TooltipContent>
                          </Tooltip>

                          {currentUserRole === 'ADMIN' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRole({
                                      userId: userRole.user_id,
                                      role: userRole.role
                                    });
                                    setSelectedRole(userRole.role);
                                    setIsRoleDialogOpen(true);
                                  }}
                                  className="hover:bg-primary/10"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Role</p>
                              </TooltipContent>
                            </Tooltip>
                          )}

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUserToDelete({
                                  id: userRole.user_id,
                                  email: userEmails[userRole.user_id] || ''
                                })}
                                className="hover:bg-destructive/10 text-destructive"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeletePatientDialog
        isOpen={!!userToDelete}
        onOpenChange={(open) => {
          if (!open) setUserToDelete(null);
        }}
        onConfirm={() => {
          if (userToDelete) {
            handleDeleteUser(userToDelete.id);
          }
        }}
        isDeleting={false}
        patientName={userToDelete?.email || ''}
      />
    </div>
  );
};

export default Admin;
