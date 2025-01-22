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

const createUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, { 
    message: "Please enter a valid phone number with country code (e.g., +1234567890)" 
  }),
  role: z.enum(["ADMIN", "MANAGER_CLINICAL", "DOCTOR", "CLINICAL_STAFF", "LAB_MANAGER", "LAB_STAFF", "FRONT_DESK"]),
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
        .select('*');
      
      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      console.log('Fetched roles:', roles);
      return roles as UserRole[];
    },
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
        .single();
      
      if (error) throw error;
      console.log('Current user role:', roles?.role);
      return roles?.role;
    },
  });

  useEffect(() => {
    const fetchUserEmails = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-user-details');
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

  const handleRoleUpdate = async (userId: string, newRole: UserRole['role']) => {
    try {
      // Only allow admins to update roles
      if (currentUserRole !== 'ADMIN') {
        toast({
          title: "Error",
          description: "Only administrators can update user roles",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating role for user:', userId, 'to:', newRole);
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

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
      setIsRoleDialogOpen(false);
      setEditingRole(null);
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('create-user', {
        body: { userId, action: 'delete' }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      refetch();
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

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
        body: { 
          userId,
          newPassword
        }
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

  const handleImpersonateUser = async (userId: string) => {
    try {
      console.log('Starting impersonation for user:', userId);
      
      // Clear all existing data before impersonation
      localStorage.clear();
      sessionStorage.clear();
      
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { targetUserId: userId }
      });

      if (error) {
        console.error('Impersonation error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to impersonate user",
          variant: "destructive",
        });
        return;
      }

      if (!data?.data?.magicLink) {
        console.error('No magic link received');
        toast({
          title: "Error",
          description: "Failed to generate login link",
          variant: "destructive",
        });
        return;
      }

      // Sign out current user first
      await supabase.auth.signOut();
      
      toast({
        title: "Impersonation Started",
        description: "You will be redirected to login as the selected user.",
      });

      // Redirect to the magic link
      window.location.href = data.data.magicLink;
      
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to impersonate user",
        variant: "destructive",
      });
    }
  };

  const filteredRoles = userRoles?.filter(role => 
    userEmails[role.user_id]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roles: UserRole['role'][] = [
    "ADMIN",
    "MANAGER_CLINICAL",
    "DOCTOR",
    "CLINICAL_STAFF",
    "LAB_MANAGER",
    "LAB_STAFF",
    "FRONT_DESK"
  ];

  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    try {
      console.log('Creating new user with values:', values);
      const { error } = await supabase.functions.invoke('create-user', {
        body: { 
          email: values.email,
          password: values.password,
          role: values.role,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone
        }
      });

      if (error) {
        console.error('Error from create-user function:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create user",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      setIsOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
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

      {/* Password Change Dialog */}
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

      {/* Role Edit Dialog */}
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
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRoles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles?.map((userRole) => (
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

      {/* User Details Edit Dialog */}
      <Dialog open={editingUserDetails !== null} onOpenChange={() => setEditingUserDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>
              Update the user's personal information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first-name">First Name</Label>
              <Input
                id="edit-first-name"
                value={editingUserDetails?.first_name || ''}
                onChange={(e) => setEditingUserDetails(prev => 
                  prev ? { ...prev, first_name: e.target.value } : null
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last-name">Last Name</Label>
              <Input
                id="edit-last-name"
                value={editingUserDetails?.last_name || ''}
                onChange={(e) => setEditingUserDetails(prev => 
                  prev ? { ...prev, last_name: e.target.value } : null
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <PhoneInput
                value={editingUserDetails?.phone || ''}
                onChange={(value) => setEditingUserDetails(prev => 
                  prev ? { ...prev, phone: value } : null
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingUserDetails(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (editingUserDetails) {
                  try {
                    const { error } = await supabase
                      .from('user_roles')
                      .update({
                        first_name: editingUserDetails.first_name,
                        last_name: editingUserDetails.last_name,
                        phone: editingUserDetails.phone
                      })
                      .eq('id', editingUserDetails.id);

                    if (error) throw error;

                    toast({
                      title: "Success",
                      description: "User details updated successfully",
                    });
                    
                    setEditingUserDetails(null);
                    refetch();
                  } catch (error) {
                    console.error('Error updating user details:', error);
                    toast({
                      title: "Error",
                      description: "Failed to update user details",
                      variant: "destructive",
                    });
                  }
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
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

