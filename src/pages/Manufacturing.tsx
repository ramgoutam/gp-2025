import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Manufacturing = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manufacturing</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manufacturing dashboard content will go here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Manufacturing;