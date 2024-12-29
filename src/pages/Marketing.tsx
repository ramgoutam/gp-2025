import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/marketing";

const Marketing = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
          <p className="text-gray-500 mt-1">Manage your marketing campaigns and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Form</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadForm />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Manage your marketing campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">View campaign performance metrics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Manage your target audience segments</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Marketing;