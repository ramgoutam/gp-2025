import React, { useState, useEffect } from 'react';
import { Shield, UserX, Pencil, Trash2, Plus, Key, UserCog, UserPen } from 'lucide-react';
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
      
      // Store current session before impersonation
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        localStorage.setItem('impersonator_session', JSON.stringify(currentSession));
      }

      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { targetUserId: userId }
      });

      if (error) {
        console.error('Impersonation error:', error);
        throw error;
      }

      console.log('Impersonation response:', data);

      if (data?.data?.magicLink) {
        toast({
          title: "Impersonation Started",
          description: "You will be redirected to login as the selected user.",
        });

        // Sign out current user before redirecting
        await supabase.auth.signOut();
        
        // Ensure we're completely signed out before redirecting
        const { error: signOutError } = await supabase.auth.getSession();
        if (!signOutError) {
          console.log('Successfully signed out, redirecting to magic link');
          window.location.href = data.data.magicLink;
        } else {
          console.error('Error checking session after sign out:', signOutError);
          toast({
            title: "Error",
            description: "Failed to complete sign out process",
            variant: "destructive",
          });
        }
      } else {
        console.error('No magic link received');
        toast({
          title: "Error",
          description: "Failed to generate login link",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error impersonating user:', error);
      toast({
        title: "Error",
        description: "Failed to impersonate user",
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

      if (error) throw error;

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
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

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

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">User Management</h3>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading users...</TableCell>
                  </TableRow>
                ) : filteredRoles?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No users found</TableCell>
                  </TableRow>
                ) : filteredRoles?.map((userRole) => (
                  <TableRow key={userRole.id}>
                    <TableCell>{userEmails[userRole.user_id] || 'Loading...'}</TableCell>
                    <TableCell>{`${userRole.first_name || ''} ${userRole.last_name || ''}`}</TableCell>
                    <TableCell>{userRole.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {editingRole?.userId === userRole.user_id ? (
                        <select
                          value={editingRole.role}
                          onChange={(e) => setEditingRole({ 
                            userId: userRole.user_id, 
                            role: e.target.value as UserRole['role'] 
                          })}
                          className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      ) : (
                        userRole.role
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleImpersonateUser(userRole.user_id)}
                        >
                          <UserCog className="h-4 w-4 mr-2" />
                          Login as
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsPasswordDialogOpen(true);
                            setChangingPasswordFor(userRole.user_id);
                          }}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRole({ 
                            userId: userRole.user_id, 
                            role: userRole.role 
                          })}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Role
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUserDetails(userRole)}
                        >
                          <UserPen className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(userRole.user_id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Admin;