// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/auth";

// export default async function SettingsPage() {
//   const user = await getCurrentUser();

//   if (!user || user.role !== "ADMIN") {
//     redirect("/dashboard");
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">System Settings</h1>
//       <p className="mt-2 text-muted-foreground">
//         Admin-only configuration.
//       </p>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Percent, Banknote, ShieldCheck } from "lucide-react";
import {
  getPayrollSettings,
  updatePayrollSettingsAction,
} from "@/src/actions/settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    sssRate: 4.5,
    philhealthRate: 2.5,
    pagibigAmount: 200,
  });

  useEffect(() => {
    async function load() {
      const data = await getPayrollSettings();
      if (data) {
        setValues({
          // 👇 Use ?? to provide a default value if the DB returns null
          sssRate: (data.sssRate ?? 0.045) * 100,
          philhealthRate: (data.philhealthRate ?? 0.025) * 100,
          pagibigAmount: data.pagibigAmount ?? 200,
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updatePayrollSettingsAction({
      sssRate: values.sssRate / 100, // Convert 4.5 back to 0.045 for DB
      philhealthRate: values.philhealthRate / 100,
      pagibigAmount: values.pagibigAmount,
    });

    if (result.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  if (loading)
    return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Settings</h1>
        <p className="text-muted-foreground">
          Manage global deduction rates for government contributions.
        </p>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            Contribution Rates
          </CardTitle>
          <CardDescription>
            Adjust the employee share for mandatory deductions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SSS RATE */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                SSS Employee Rate (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  value={values.sssRate}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      sssRate: parseFloat(e.target.value),
                    })
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Standard rate is currently 4.5%
              </p>
            </div>

            {/* PhilHealth RATE */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                PhilHealth Employee Rate (%)
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  value={values.philhealthRate}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      philhealthRate: parseFloat(e.target.value),
                    })
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Based on the 5% total split between ER/EE.
              </p>
            </div>

            {/* Pag-IBIG AMOUNT */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Pag-IBIG (HDMF) Fixed Amount
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={values.pagibigAmount}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      pagibigAmount: parseFloat(e.target.value),
                    })
                  }
                  className="pl-9"
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                Standard deduction is ₱200.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
