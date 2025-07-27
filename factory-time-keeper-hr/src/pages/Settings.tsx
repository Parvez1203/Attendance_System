
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure system settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Settings configuration will be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
