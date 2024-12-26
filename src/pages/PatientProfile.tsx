import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Calendar, MapPin, User2, Heart, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address?: string;
  emergencyContactName?: string;
  emergencyPhone?: string;
  treatmentType?: string;
  upperTreatment?: string;
  lowerTreatment?: string;
}

const PatientProfile = () => {
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        console.log("Fetching patient data for ID:", id);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          console.log("Patient data fetched:", data);
          setPatientData({
            id: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            sex: data.sex,
            dob: data.dob,
            address: data.address,
            emergencyContactName: data.emergency_contact_name,
            emergencyPhone: data.emergency_phone,
            treatmentType: data.treatment_type,
            upperTreatment: data.upper_treatment,
            lowerTreatment: data.lower_treatment,
          });
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load patient data",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Patient not found</p>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, title, value }: { icon: any; title: string; value: string }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100 hover:border-primary/20 transition-all duration-200">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="text-sm text-gray-500 mb-6 hover:text-primary transition-colors duration-300">
        Patient list / Patient detail
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User2 className="w-6 h-6 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard 
              icon={User2}
              title="First Name" 
              value={patientData.firstName} 
            />
            <InfoCard 
              icon={User2}
              title="Last Name" 
              value={patientData.lastName} 
            />
            <InfoCard 
              icon={Mail}
              title="Email" 
              value={patientData.email} 
            />
            <InfoCard 
              icon={Phone}
              title="Phone" 
              value={patientData.phone} 
            />
            <InfoCard 
              icon={User2}
              title="Sex" 
              value={patientData.sex.charAt(0).toUpperCase() + patientData.sex.slice(1)} 
            />
            <InfoCard 
              icon={Calendar}
              title="Date of Birth" 
              value={new Date(patientData.dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} 
            />
            {patientData.address && (
              <div className="col-span-full">
                <InfoCard 
                  icon={MapPin}
                  title="Address" 
                  value={patientData.address}
                />
              </div>
            )}
            {patientData.emergencyContactName && (
              <InfoCard 
                icon={Heart}
                title="Emergency Contact" 
                value={`${patientData.emergencyContactName} (${patientData.emergencyPhone})`} 
              />
            )}
            {patientData.treatmentType && (
              <div className="col-span-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoCard 
                    icon={Stethoscope}
                    title="Treatment Type" 
                    value={patientData.treatmentType.charAt(0).toUpperCase() + patientData.treatmentType.slice(1)}
                  />
                  {patientData.upperTreatment && (
                    <InfoCard 
                      icon={Stethoscope}
                      title="Upper Treatment" 
                      value={patientData.upperTreatment}
                    />
                  )}
                  {patientData.lowerTreatment && (
                    <InfoCard 
                      icon={Stethoscope}
                      title="Lower Treatment" 
                      value={patientData.lowerTreatment}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;