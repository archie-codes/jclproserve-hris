import { notFound } from "next/navigation";
import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { format, differenceInYears } from "date-fns";
import { 
  User, Briefcase, Building2, Phone, CalendarDays, ShieldCheck, 
  ChevronLeft, CreditCard, Mail, MapPin, Printer, Edit, Download
} from "lucide-react";
import Link from "next/link";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 👈 Ensure AvatarImage is imported
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function EmployeeProfilePage({ params }: PageProps) {
  const { employeeId } = await params;

  // 1. Fetch Employee (imageUrl will now be included automatically)
  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, employeeId),
  });

  if (!employee) return notFound();

  // --- HELPERS ---
  const formatDate = (date: string | Date | null) => 
    date ? format(new Date(date), "MMMM dd, yyyy") : "N/A";
  
  const getInitials = (f: string, l: string) => `${f[0]}${l[0]}`.toUpperCase();
  
  const calculateAge = (dob: string | Date | null) => 
    dob ? `${differenceInYears(new Date(), new Date(dob))} yrs old` : "N/A";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REGULAR": 
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "PROBATIONARY": 
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "RESIGNED": 
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default: 
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-6 space-y-6 md:space-y-8">
      
      {/* --- TOP NAV --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-foreground w-fit">
            <Link href="/dashboard/employees">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Employees
            </Link>
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT SIDEBAR: ID CARD --- */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-t-4 border-t-primary shadow-sm bg-card">
            <div className="bg-linear-to-b from-primary/10 to-transparent dark:from-primary/5 h-24" />
            <CardContent className="relative pt-0 pb-8 text-center">
              
              {/* 👇 UPDATED AVATAR SECTION */}
              <div className="-mt-12 mb-4 flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md bg-white">
                  {/* 1. Show Image if it exists */}
                  <AvatarImage 
                    src={employee.imageUrl || ""} 
                    alt="Employee Photo" 
                    className="object-cover"
                  />
                  {/* 2. Fallback to Initials if no image */}
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* 👆 END UPDATED SECTION */}

              <h2 className="text-2xl font-bold text-foreground">
                {employee.firstName} {employee.lastName} {employee.suffix}
              </h2>
              <p className="text-muted-foreground font-medium">{employee.position || "No Position"}</p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge className={getStatusColor(employee.status)} variant="outline">
                  {employee.status}
                </Badge>
                <Badge variant="secondary" className="font-mono">
                  {employee.employeeNo}
                </Badge>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-left">
                 <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase">Department</p>
                    <p className="font-semibold text-sm truncate text-foreground">{employee.department || "N/A"}</p>
                 </div>
                 <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase">Tenure</p>
                    <p className="font-semibold text-sm text-foreground">
                      {differenceInYears(new Date(), new Date(employee.dateHired))} Years
                    </p>
                 </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start overflow-hidden text-ellipsis" asChild>
                  <a href={`mailto:${employee.email}`}>
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{employee.email}</span>
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${employee.mobileNumber}`}>
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {employee.mobileNumber || "No Mobile"}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                   <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{employee.emergencyContactName || "Not Set"}</p>
                  <p className="text-xs text-muted-foreground">{employee.emergencyContactPhone || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT CONTENT: DETAILS --- */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="personal" className="w-full">
            <div className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <TabsList className="w-full md:w-auto inline-flex justify-start border-b rounded-none h-auto p-0 bg-transparent gap-4 md:gap-6 min-w-max">
                <TabTrigger value="personal">Personal</TabTrigger>
                <TabTrigger value="employment">Employment</TabTrigger>
                <TabTrigger value="financial">Financial</TabTrigger>
                <TabTrigger value="documents">Documents</TabTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal" className="mt-6 space-y-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Personal bio-data and demographic info.</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <DetailRow label="First Name" value={employee.firstName} />
                    <DetailRow label="Middle Name" value={employee.middleName} />
                    <DetailRow label="Last Name" value={employee.lastName} />
                    <DetailRow label="Suffix" value={employee.suffix} />
                    <Separator className="sm:col-span-2 my-2" />
                    <DetailRow label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
                    <DetailRow label="Age" value={calculateAge(employee.dateOfBirth)} />
                    <DetailRow label="Gender" value={employee.gender} />
                    <DetailRow label="Civil Status" value={employee.civilStatus} />
                    <DetailRow label="Nationality" value={employee.nationality || "Filipino"} />
                  </dl>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Address & Contact</CardTitle>
                </CardHeader>
                <CardContent>
                   <dl className="grid grid-cols-1 gap-y-4">
                      <DetailRow label="Current Address" value={employee.address} fullWidth icon={<MapPin className="h-4 w-4 text-muted-foreground"/>} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                        <DetailRow label="Personal Email" value={employee.personalEmail} />
                        <DetailRow label="Mobile Number" value={employee.mobileNumber} />
                      </div>
                   </dl>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="mt-6 space-y-6">
               <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                  <CardDescription>Current role and status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <DetailRow label="Employee ID" value={employee.employeeNo} />
                     <DetailRow label="Date Hired" value={formatDate(employee.dateHired)} />
                     <DetailRow label="Position" value={employee.position} />
                     <DetailRow label="Department" value={employee.department} />
                     <DetailRow label="Employment Status" value={employee.status} />
                     <DetailRow label="Regularization Date" value={formatDate(employee.dateRegularized)} />
                  </dl>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Government Identifiers</CardTitle>
                  <CardDescription>Statutory numbers for payroll processing.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <GovtIdCard label="SSS Number" value={employee.sssNo} color="blue" />
                      <GovtIdCard label="PhilHealth" value={employee.philHealthNo} color="green" />
                      <GovtIdCard label="Pag-IBIG / HDMF" value={employee.pagIbigNo} color="orange" />
                      <GovtIdCard label="TIN (Tax ID)" value={employee.tinNo} color="gray" />
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Payroll & Banking</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailRow label="Bank Name" value={employee.bankName} icon={<Building2 className="h-4 w-4"/>} />
                    <DetailRow label="Account Number" value={employee.bankAccountNo} icon={<CreditCard className="h-4 w-4"/>} />
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            
             <TabsContent value="documents" className="mt-6">
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                   <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                     <Download className="h-6 w-6 text-muted-foreground" />
                   </div>
                   <h3 className="font-semibold text-lg text-foreground">No Documents Uploaded</h3>
                   <p className="text-muted-foreground text-sm max-w-sm mt-1">
                     Upload contracts, resumes, and other 201 file documents here.
                   </p>
                   <Button variant="outline" className="mt-4">Upload Document</Button>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  return (
    <TabsTrigger 
      value={value} 
      className="
        data-[state=active]:bg-transparent 
        data-[state=active]:shadow-none 
        data-[state=active]:border-b-2 
        data-[state=active]:border-primary 
        rounded-none px-2 py-3 md:px-4 
        text-muted-foreground 
        data-[state=active]:text-foreground
        whitespace-nowrap
      "
    >
      {children}
    </TabsTrigger>
  )
}

function DetailRow({ label, value, icon, fullWidth }: { label: string, value: string | null | undefined, icon?: React.ReactNode, fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
        {icon} {label}
      </dt>
      <dd className="text-base font-medium text-foreground">{value || "N/A"}</dd>
    </div>
  )
}

function GovtIdCard({ label, value, color }: { label: string, value?: string | null, color: string }) {
  const borderColor = {
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    orange: "border-l-orange-500",
    gray: "border-l-gray-500",
  }[color] || "border-l-gray-300";

  return (
    <div className={`p-4 border rounded-lg bg-card border-l-4 ${borderColor} shadow-sm transition-colors`}>
      <p className="text-xs text-muted-foreground uppercase font-semibold">{label}</p>
      <p className="text-lg font-mono font-medium tracking-wide mt-1 text-foreground">
        {value || "Not Recorded"}
      </p>
    </div>
  )
}