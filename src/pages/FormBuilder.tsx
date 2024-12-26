import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Search, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export const FormBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [showNewFormDialog, setShowNewFormDialog] = useState(false);
  const [newFormName, setNewFormName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('form_templates')
        .select('*')
        .ilike('name', `%${searchQuery}%`);

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch forms",
        variant: "destructive",
      });
    }
  };

  const handleCreateNewForm = async () => {
    if (!newFormName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a form name",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple simultaneous submissions
    if (isCreating) return;

    setIsCreating(true);

    try {
      const { data, error } = await supabase
        .from('form_templates')
        .insert({
          name: newFormName,
          config: { components: [] }
        })
        .select()
        .single();

      if (error) throw error;

      setShowNewFormDialog(false);
      setNewFormName("");
      navigate(`/form-builder/${data.id}`);
      
      toast({
        title: "Success",
        description: "Form created successfully",
      });
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // ... keep existing code (rest of the component remains the same)

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Form Templates</h1>
        <Button 
          onClick={() => setShowNewFormDialog(true)}
          className="bg-primary hover:bg-primary/90"
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          Build New Form
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search forms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>{form.name}</span>
                </div>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/form-builder/${form.id}`)}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{form.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {new Date(form.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {forms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No forms found. Click "Build New Form" to create one.
          </div>
        )}
      </div>

      <Dialog open={showNewFormDialog} onOpenChange={setShowNewFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="formName">Form Name</Label>
              <Input
                id="formName"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
                placeholder="Enter form name"
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewFormDialog(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNewForm} 
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Form'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
