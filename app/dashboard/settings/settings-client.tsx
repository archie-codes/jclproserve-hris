"use client";

import { useState } from "react";
import { Save, Shield, Server, Bell, AlertTriangle } from "lucide-react";

interface SettingsClientProps {
  user: any;
  initialSettings: any;
}

export default function SettingsClient({ user, initialSettings }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  // Mock functionality for saving
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 shrink-0 space-y-1 mb-6 md:mb-0">
        <TabButton 
          active={activeTab === "general"} 
          onClick={() => setActiveTab("general")} 
          icon={<Server size={18} />} 
          label="General" 
        />
        <TabButton 
          active={activeTab === "security"} 
          onClick={() => setActiveTab("security")} 
          icon={<Shield size={18} />} 
          label="Security" 
        />
        <TabButton 
          active={activeTab === "notifications"} 
          onClick={() => setActiveTab("notifications")} 
          icon={<Bell size={18} />} 
          label="Notifications" 
        />
        {/* Added dark mode border color */}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
          <TabButton 
            active={activeTab === "danger"} 
            onClick={() => setActiveTab("danger")} 
            icon={<AlertTriangle size={18} />} 
            label="Danger Zone" 
            danger 
          />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        
        {/* General Tab */}
        {activeTab === "general" && (
          <Card title="General Configuration" description="Basic system information and operational modes.">
            <div className="space-y-4">
              <InputGroup label="System Name" defaultValue={initialSettings.systemName} />
              <InputGroup label="Support Email" defaultValue={initialSettings.supportEmail} type="email" />
              
              {/* Updated border and text colors for dark mode */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-800 mt-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Disable access for non-admin users.</p>
                </div>
                <ToggleSwitch defaultChecked={initialSettings.maintenanceMode} />
              </div>
            </div>
            <CardFooter isLoading={isLoading} onSave={handleSave} />
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <Card title="Security Settings" description="Manage access control and registration policies.">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Allow New Registrations</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">If disabled, only admins can create users.</p>
                </div>
                <ToggleSwitch defaultChecked={initialSettings.allowRegistrations} />
              </div>
              
              <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Enforce 2FA for Admins</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Require two-factor authentication for all admin accounts.</p>
                </div>
                <ToggleSwitch defaultChecked={false} />
              </div>
            </div>
            <CardFooter isLoading={isLoading} onSave={handleSave} />
          </Card>
        )}

        {/* Danger Zone Tab - Heavily updated for dark mode red variants */}
        {activeTab === "danger" && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Danger Zone</h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1 mb-4">
              Irreversible actions. Please proceed with caution.
            </p>
            
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded border border-red-100 dark:border-red-900/50">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Reset System Database</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">This will delete all user data and logs.</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors dark:hover:bg-red-500">
                Reset Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub Components Updated for Dark Mode ---

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    // Updated BG, Border colors
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors">
      {/* Updated Header BG and border */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function CardFooter({ isLoading, onSave }: { isLoading: boolean; onSave: () => void }) {
  return (
    // Updated border color
    <div className="mt-6 flex justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
      <button
        onClick={onSave}
        disabled={isLoading}
        // Updated blue shades for better dark mode contrast
        className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <span className="animate-spin mr-2">⚪</span>
        ) : (
          <Save size={16} className="mr-2" />
        )}
        Save Changes
      </button>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, danger }: any) {
  // Complex logic to handle active/inactive states in both light and dark modes
  const baseClasses = "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors";
  
  let activeClasses = "";
  let inactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50";
  let iconColor = "text-gray-400 dark:text-gray-500";

  if (active) {
    if (danger) {
      // Active Danger State
      activeClasses = "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400";
      iconColor = "text-red-600 dark:text-red-400";
    } else {
      // Active Standard State
      activeClasses = "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400";
      iconColor = "text-blue-600 dark:text-blue-400";
    }
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className={`mr-3 ${iconColor}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function InputGroup({ label, defaultValue, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        // Updated input BG, border, text, and focus rings for dark mode
        className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
      />
    </div>
  );
}

function ToggleSwitch({ defaultChecked }: { defaultChecked: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      // Updated background color for the inactive state in dark mode
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}