import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/utils/databaseUtils";
import { useToast } from "@/components/ui/use-toast";
import { usePatientStore } from "@/stores/patientStore";
import { LoadingState } from "./table/LoadingState";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { User, LayoutGrid, List } from "lucide-react";
import { PatientAvatar } from "./header/PatientAvatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DataTable } from "./table/DataTable";
import { columns } from "./table/columns";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PatientSearch } from "./PatientSearch";

export const PatientList = () => {
  const { toast } = useToast();
  const { searchQuery } = usePatientStore();
  const [viewMode, setViewMode] = useState<'card' | 'list'>('list');
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for patients');
    const channel = supabase
      .channel('patient-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          queryClient.invalidateQueries({ queryKey: ['patients'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients data');
      const data = await getPatients();
      console.log('Fetched patients:', data.length);
      return data;
    },
    refetchInterval: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching patients:', error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please try again.",
          variant: "destructive",
        });
      }
    }
  });

  const filteredPatients = patients.filter(patient => {
    const searchTerm = searchQuery?.toLowerCase() || '';
    return (
      patient.first_name?.toLowerCase().includes(searchTerm) ||
      patient.last_name?.toLowerCase().includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const toggleView = () => {
    setViewMode(viewMode === 'card' ? 'list' : 'card');
  };

  const renderViewToggle = () => (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleView}
      className="flex items-center gap-2"
    >
      {viewMode === 'card' ? (
        <>
          <List className="h-4 w-4" />
          List View
        </>
      ) : (
        <>
          <LayoutGrid className="h-4 w-4" />
          Card View
        </>
      )}
    </Button>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient) => (
          <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow bg-background">
            <div className="flex items-center space-x-4">
              <PatientAvatar
                firstName={patient.first_name}
                lastName={patient.last_name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium truncate">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  {patient.treatment_type && (
                    <Badge variant="outline" className="ml-2">
                      {patient.treatment_type}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    {patient.upper_treatment && (
                      <span className="truncate">
                        Upper: {patient.upper_treatment}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {patient.lower_treatment && (
                      <span className="truncate">
                        Lower: {patient.lower_treatment}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant={patient.upper_treatment || patient.lower_treatment ? "default" : "secondary"}
                    className={patient.upper_treatment || patient.lower_treatment ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    {patient.upper_treatment || patient.lower_treatment ? "In Treatment" : "Not Started"}
                  </Badge>
                  
                  <Link 
                    to={`/patient/${patient.id}`}
                    state={{ patientData: {
                      ...patient,
                      firstName: patient.first_name,
                      lastName: patient.last_name,
                    }}}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
                  >
                    <User className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No patients found.</p>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="bg-background rounded-md border h-[calc(100vh-13rem)] px-4 pb-4">
      <DataTable columns={columns} data={filteredPatients} />
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6 px-4">
        <PatientSearch />
        {renderViewToggle()}
      </div>
      {viewMode === 'card' ? renderCardView() : renderListView()}
    </div>
  );
};