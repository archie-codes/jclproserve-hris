// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils"; // Ensure you have this utility
// import { toast } from "sonner";
// import {
//   Loader2,
//   CheckCircle2,
//   User,
//   ChevronRight,
//   AlertCircle,
// } from "lucide-react";
// import { submitExam } from "@/src/actions/kiosk";
// import Image from "next/image";

// type Exam = {
//   id: string;
//   title: string;
//   questions: {
//     id: string;
//     text: string;
//     imageUrl?: string | null;
//     choices: { id: string; text: string; imageUrl?: string | null }[];
//   }[];
// };

// export function KioskForm({ exams }: { exams: Exam[] }) {
//   const [step, setStep] = useState<"REGISTER" | "EXAM" | "DONE">("REGISTER");
//   const [isLoading, setIsLoading] = useState(false);

//   // Registration State
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [position, setPosition] = useState(""); // 👈 NEW: Separate position state
//   const [selectedExamId, setSelectedExamId] = useState("");

//   // Exam State
//   const [answers, setAnswers] = useState<Record<string, string>>({});

//   const selectedExam = exams.find((e) => e.id === selectedExamId);

//   const handleStart = () => {
//     if (
//       !firstName.trim() ||
//       !lastName.trim() ||
//       !position.trim() ||
//       !selectedExamId
//     ) {
//       toast.error("Please fill in all fields to start.");
//       return;
//     }
//     setStep("EXAM");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = async () => {
//     // Validation: Check if all questions are answered
//     if (selectedExam) {
//       const unansweredCount =
//         selectedExam.questions.length - Object.keys(answers).length;
//       if (unansweredCount > 0) {
//         toast.error(`You have ${unansweredCount} unanswered questions.`);
//         return;
//       }
//     }

//     setIsLoading(true);
//     try {
//       const result = await submitExam({
//         examId: selectedExamId,
//         applicant: {
//           firstName,
//           lastName,
//           position: position.toUpperCase(),
//         },
//         answers,
//       });

//       if (result.success) {
//         setStep("DONE");
//       } else {
//         toast.error("Submission failed. Please call HR.");
//       }
//     } catch (e) {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- VIEW 1: REGISTRATION ---
//   if (step === "REGISTER") {
//     return (
//       <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//         <div className="text-center space-y-2">
//           <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="h-8 w-8 text-blue-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-900">Welcome!</h2>
//           <p className="text-slate-500">
//             Please enter your details to begin the assessment.
//           </p>
//         </div>

//         <div className="space-y-5">
//           {/* NAME INPUTS (Keep as is) */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label className="text-sm font-semibold text-slate-700">
//                 First Name
//               </Label>
//               <Input
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value.toUpperCase())}
//                 placeholder="JUAN"
//                 className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-semibold text-slate-700">
//                 Last Name
//               </Label>
//               <Input
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value.toUpperCase())}
//                 placeholder="DELA CRUZ"
//                 className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {/* 👇 NEW: POSITION INPUT */}
//           <div className="space-y-2">
//             <Label className="text-sm font-semibold text-slate-700">
//               Position Applying For
//             </Label>
//             <Input
//               value={position}
//               onChange={(e) => setPosition(e.target.value.toUpperCase())}
//               placeholder="E.G. AREA COORDINATOR / HOUSEKEEPING"
//               className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//             />
//           </div>

//           {/* 👇 UPDATED: EXAM SELECTION */}
//           <div className="space-y-2">
//             <Label className="text-sm font-semibold text-slate-700">
//               Select Exam to Take
//             </Label>
//             <Select value={selectedExamId} onValueChange={setSelectedExamId}>
//               <SelectTrigger className="h-12 text-lg bg-slate-50 border-slate-200 w-full">
//                 <SelectValue placeholder="Select the exam assigned by HR..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {exams.map((exam) => (
//                   <SelectItem
//                     key={exam.id}
//                     value={exam.id}
//                     className="text-base py-3 cursor-pointer"
//                   >
//                     {exam.title}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <p className="text-xs text-slate-400">
//               *Ask the HR officer which exam you should select.
//             </p>
//           </div>
//         </div>

//         <Button
//           onClick={handleStart}
//           className="w-full h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
//         >
//           Begin Assessment <ChevronRight className="ml-2 h-5 w-5" />
//         </Button>
//       </div>
//     );
//   }

//   // --- VIEW 2: TAKING THE EXAM ---
//   if (step === "EXAM" && selectedExam) {
//     const answeredCount = Object.keys(answers).length;
//     const totalCount = selectedExam.questions.length;
//     const progress = Math.round((answeredCount / totalCount) * 100);

//     return (
//       <div className="space-y-8 animate-in fade-in duration-500">
//         {/* Sticky Header with Progress */}
//         <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md py-4 border-b shadow-sm -mx-6 px-6 md:-mx-10 md:px-10 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-slate-700">
//               {selectedExam.title}
//             </span>
//             <span className="text-sm font-medium text-slate-500">
//               {answeredCount} of {totalCount} answered
//             </span>
//           </div>
//           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-blue-600 transition-all duration-500 ease-out"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         <div className="space-y-12 max-w-3xl mx-auto pb-10">
//           {selectedExam.questions.map((q, index) => (
//             <div key={q.id} className="scroll-mt-32" id={`question-${q.id}`}>
//               <div className="flex items-start gap-4 mb-6">
//                 <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
//                   {index + 1}
//                 </span>
//                 <h3 className="text-xl font-medium text-slate-900 leading-relaxed">
//                   {q.text}
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 gap-3 pl-12">
//                 {q.choices.map((c) => {
//                   const isSelected = answers[q.id] === c.id;
//                   return (
//                     <div
//                       key={c.id}
//                       onClick={() =>
//                         setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
//                       }
//                       className={cn(
//                         "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
//                         isSelected
//                           ? "border-blue-600 bg-blue-50/50 shadow-sm"
//                           : "border-slate-200 hover:border-blue-300 hover:bg-slate-50",
//                       )}
//                     >
//                       {/* Custom Radio Circle */}
//                       <div
//                         className={cn(
//                           "h-5 w-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors",
//                           isSelected
//                             ? "border-blue-600 bg-blue-600"
//                             : "border-slate-300 group-hover:border-blue-400",
//                         )}
//                       >
//                         {isSelected && (
//                           <div className="h-2 w-2 bg-white rounded-full" />
//                         )}
//                       </div>

//                       <span
//                         className={cn(
//                           "text-lg font-medium",
//                           isSelected ? "text-blue-900" : "text-slate-700",
//                         )}
//                       >
//                         {c.text}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex flex-col items-center gap-4 pt-8 border-t">
//           {answeredCount < totalCount && (
//             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium">
//               <AlertCircle className="h-4 w-4" />
//               You have unanswered questions.
//             </div>
//           )}

//           <Button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             size="lg"
//             className="w-full md:w-auto min-w-50 h-14 text-lg"
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//             ) : (
//               "Submit Assessment"
//             )}
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // --- VIEW 3: DONE ---
//   return (
//     <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in zoom-in duration-300 text-center">
//       <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
//         <CheckCircle2 className="h-12 w-12 text-green-600" />
//       </div>

//       <div className="space-y-2">
//         <h2 className="text-3xl font-bold text-slate-900">
//           Assessment Submitted!
//         </h2>
//         <p className="text-slate-500 max-w-md mx-auto text-lg">
//           Thank you, <strong>{firstName}</strong>. Your results have been
//           successfully recorded.
//         </p>
//       </div>

//       <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 max-w-md w-full mt-8">
//         <p className="font-medium text-slate-700 mb-2">Next Steps:</p>
//         <p className="text-sm text-slate-500">
//           Please notify the HR Officer that you have completed the exam. They
//           will review your results immediately.
//         </p>
//       </div>

//       <Button
//         variant="outline"
//         onClick={() => window.location.reload()}
//         className="mt-8 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//       >
//         Start New Session (Clear)
//       </Button>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
// import { toast } from "sonner";
// import {
//   Loader2,
//   CheckCircle2,
//   User,
//   ChevronRight,
//   AlertCircle,
// } from "lucide-react";
// import { submitExam } from "@/src/actions/kiosk";
// import Image from "next/image";

// type Exam = {
//   id: string;
//   title: string;
//   questions: {
//     id: string;
//     text: string;
//     imageUrl?: string | null;
//     choices: { id: string; text: string; imageUrl?: string | null }[];
//   }[];
// };

// export function KioskForm({ exams }: { exams: Exam[] }) {
//   const [step, setStep] = useState<"REGISTER" | "EXAM" | "DONE">("REGISTER");
//   const [isLoading, setIsLoading] = useState(false);

//   // Registration State
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [position, setPosition] = useState("");
//   const [selectedExamId, setSelectedExamId] = useState("");

//   // Exam State
//   const [answers, setAnswers] = useState<Record<string, string>>({});

//   const selectedExam = exams.find((e) => e.id === selectedExamId);

//   const handleStart = () => {
//     if (
//       !firstName.trim() ||
//       !lastName.trim() ||
//       !position.trim() ||
//       !selectedExamId
//     ) {
//       toast.error("Please fill in all fields to start.");
//       return;
//     }
//     setStep("EXAM");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = async () => {
//     if (selectedExam) {
//       const unansweredCount =
//         selectedExam.questions.length - Object.keys(answers).length;
//       if (unansweredCount > 0) {
//         toast.error(`You have ${unansweredCount} unanswered questions.`);
//         return;
//       }
//     }

//     setIsLoading(true);
//     try {
//       const result = await submitExam({
//         examId: selectedExamId,
//         applicant: {
//           firstName,
//           lastName,
//           position: position.toUpperCase(),
//         },
//         answers,
//       });

//       if (result.success) {
//         setStep("DONE");
//       } else {
//         toast.error("Submission failed. Please call HR.");
//       }
//     } catch (e) {
//       toast.error("Network error. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- VIEW 1: REGISTRATION ---
//   if (step === "REGISTER") {
//     return (
//       <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//         <div className="text-center space-y-2">
//           <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="h-8 w-8 text-blue-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-slate-900">Welcome!</h2>
//           <p className="text-slate-500">
//             Please enter your details to begin the assessment.
//           </p>
//         </div>

//         <div className="space-y-5">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label className="text-sm font-semibold text-slate-700">
//                 First Name
//               </Label>
//               <Input
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value.toUpperCase())}
//                 placeholder="JUAN"
//                 className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-sm font-semibold text-slate-700">
//                 Last Name
//               </Label>
//               <Input
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value.toUpperCase())}
//                 placeholder="DELA CRUZ"
//                 className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="text-sm font-semibold text-slate-700">
//               Position Applying For
//             </Label>
//             <Input
//               value={position}
//               onChange={(e) => setPosition(e.target.value.toUpperCase())}
//               placeholder="E.G. AREA COORDINATOR"
//               className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-sm font-semibold text-slate-700">
//               Select Exam to Take
//             </Label>
//             <Select value={selectedExamId} onValueChange={setSelectedExamId}>
//               <SelectTrigger className="h-12 text-lg bg-slate-50 border-slate-200 w-full">
//                 <SelectValue placeholder="Select the assigned exam..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {exams.map((exam) => (
//                   <SelectItem
//                     key={exam.id}
//                     value={exam.id}
//                     className="text-base py-3"
//                   >
//                     {exam.title}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Button
//           onClick={handleStart}
//           className="w-full h-12 text-lg font-medium shadow-lg transition-all"
//         >
//           Begin Assessment <ChevronRight className="ml-2 h-5 w-5" />
//         </Button>
//       </div>
//     );
//   }

//   // --- VIEW 2: TAKING THE EXAM ---
//   if (step === "EXAM" && selectedExam) {
//     const answeredCount = Object.keys(answers).length;
//     const totalCount = selectedExam.questions.length;
//     const progress = Math.round((answeredCount / totalCount) * 100);

//     return (
//       <div className="space-y-8 animate-in fade-in duration-500">
//         <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md py-4 border-b shadow-sm -mx-6 px-6 md:-mx-10 md:px-10 transition-all">
//           <div className="flex justify-between items-center mb-2">
//             <span className="font-semibold text-slate-700">
//               {selectedExam.title}
//             </span>
//             <span className="text-sm font-medium text-slate-500">
//               {answeredCount} of {totalCount} answered
//             </span>
//           </div>
//           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-blue-600 transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>

//         <div className="space-y-16 max-w-4xl mx-auto pb-10">
//           {selectedExam.questions.map((q, index) => {
//             const hasChoiceImages = q.choices.some((c) => c.imageUrl);

//             return (
//               <div
//                 key={q.id}
//                 className="scroll-mt-32 border-b pb-12 last:border-0"
//                 id={`question-${q.id}`}
//               >
//                 {/* Question Section */}
//                 <div className="flex items-start gap-4 mb-6">
//                   <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">
//                     {index + 1}
//                   </span>
//                   <div className="space-y-4 w-full">
//                     <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
//                       {q.text}
//                     </h3>

//                     {/* Visual Puzzle Image */}
//                     {q.imageUrl && (
//                       <div className="relative w-full h-48 md:h-72 bg-white rounded-lg border-2 border-slate-100 shadow-sm overflow-hidden p-2">
//                         <Image
//                           src={q.imageUrl}
//                           alt="Diagram"
//                           fill
//                           className="object-contain"
//                           unoptimized
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Choices Section */}
//                 <div
//                   className={cn(
//                     "grid gap-4 pl-12",
//                     hasChoiceImages
//                       ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
//                       : "grid-cols-1",
//                   )}
//                 >
//                   {q.choices.map((c) => {
//                     const isSelected = answers[q.id] === c.id;
//                     return (
//                       <div
//                         key={c.id}
//                         onClick={() =>
//                           setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
//                         }
//                         className={cn(
//                           "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
//                           isSelected
//                             ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600"
//                             : "border-slate-200 hover:border-blue-300 hover:bg-slate-50",
//                         )}
//                       >
//                         {/* Image for Option (if exists) */}
//                         {c.imageUrl && (
//                           <div className="relative w-full h-24 mb-3 border rounded bg-white">
//                             <Image
//                               src={c.imageUrl}
//                               alt={c.text}
//                               fill
//                               className="object-contain p-1"
//                               unoptimized
//                             />
//                           </div>
//                         )}

//                         <div className="flex items-center gap-3">
//                           <div
//                             className={cn(
//                               "h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
//                               isSelected
//                                 ? "border-blue-600 bg-blue-600"
//                                 : "border-slate-300 group-hover:border-blue-400",
//                             )}
//                           >
//                             {isSelected && (
//                               <div className="h-2 w-2 bg-white rounded-full" />
//                             )}
//                           </div>
//                           <span
//                             className={cn(
//                               "text-lg font-medium",
//                               isSelected ? "text-blue-900" : "text-slate-700",
//                             )}
//                           >
//                             {c.text}
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex flex-col items-center gap-4 pt-8 border-t">
//           {answeredCount < totalCount && (
//             <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium">
//               <AlertCircle className="h-4 w-4" /> You have{" "}
//               {totalCount - answeredCount} unanswered questions.
//             </div>
//           )}
//           <Button
//             onClick={handleSubmit}
//             disabled={isLoading}
//             size="lg"
//             className="w-full md:w-auto min-w-50 h-14 text-lg"
//           >
//             {isLoading ? (
//               <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//             ) : (
//               "Submit Assessment"
//             )}
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // --- VIEW 3: DONE ---
//   return (
//     <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in zoom-in duration-300 text-center">
//       <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
//         <CheckCircle2 className="h-12 w-12 text-green-600" />
//       </div>
//       <div className="space-y-2">
//         <h2 className="text-3xl font-bold text-slate-900">
//           Assessment Submitted!
//         </h2>
//         <p className="text-slate-500 max-w-md mx-auto text-lg">
//           Thank you, <strong>{firstName}</strong>. Your results have been
//           recorded.
//         </p>
//       </div>
//       <Button
//         variant="outline"
//         onClick={() => window.location.reload()}
//         className="mt-8"
//       >
//         Start New Session
//       </Button>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  User,
  ChevronRight,
  AlertCircle,
  Timer, // 👈 Import Timer icon
} from "lucide-react";
import { submitExam } from "@/src/actions/kiosk";
import Image from "next/image";

type Exam = {
  id: string;
  title: string;
  timeLimit: number | null;
  questions: {
    id: string;
    text: string;
    imageUrl?: string | null;
    choices: { id: string; text: string; imageUrl?: string | null }[];
  }[];
};

export function KioskForm({ exams }: { exams: Exam[] }) {
  const [step, setStep] = useState<"REGISTER" | "EXAM" | "DONE">("REGISTER");
  const [isLoading, setIsLoading] = useState(false);

  // Registration State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  // Exam & Timer State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // 👈 Timer state in seconds

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  // --- TIMER LOGIC ---
  useEffect(() => {
    // Only run if they are taking the exam, and the timer hasn't stopped
    if (step !== "EXAM" || timeLeft === null || isLoading) return;

    // If time hits 0, Auto-submit
    if (timeLeft <= 0) {
      toast.error("Time is up! Submitting your exam automatically.");
      handleSubmit(true); // Force submit
      setTimeLeft(null); // Stop timer
      return;
    }

    // Tick down every second
    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [step, timeLeft, isLoading]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStart = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !position.trim() ||
      !selectedExamId
    ) {
      toast.error("Please fill in all fields to start.");
      return;
    }

    // Set the timer based on the selected exam's time limit (convert minutes to seconds)
    if (selectedExam?.timeLimit) {
      setTimeLeft(selectedExam.timeLimit * 60);
    }

    setStep("EXAM");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 👈 Added `isAutoSubmit` flag so it bypasses validation if time is up
  const handleSubmit = async (isAutoSubmit = false) => {
    if (selectedExam && !isAutoSubmit) {
      const unansweredCount =
        selectedExam.questions.length - Object.keys(answers).length;
      if (unansweredCount > 0) {
        toast.error(`You have ${unansweredCount} unanswered questions.`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const result = await submitExam({
        examId: selectedExamId,
        applicant: {
          firstName,
          lastName,
          position: position.toUpperCase(),
        },
        answers,
      });

      if (result.success) {
        setStep("DONE");
      } else {
        toast.error("Submission failed. Please call HR.");
      }
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- VIEW 1: REGISTRATION ---
  if (step === "REGISTER") {
    return (
      <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome!</h2>
          <p className="text-slate-500">
            Please enter your details to begin the assessment.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                First Name
              </Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value.toUpperCase())}
                placeholder="JUAN"
                className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                Last Name
              </Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value.toUpperCase())}
                placeholder="DELA CRUZ"
                className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Position Applying For
            </Label>
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value.toUpperCase())}
              placeholder="E.G. AREA COORDINATOR"
              className="h-12 text-lg bg-slate-50 border-slate-200 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Select Exam to Take
            </Label>
            <Select value={selectedExamId} onValueChange={setSelectedExamId}>
              <SelectTrigger className="h-12 text-lg bg-slate-50 border-slate-200 w-full">
                <SelectValue placeholder="Select the assigned exam..." />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem
                    key={exam.id}
                    value={exam.id}
                    className="text-base py-3"
                  >
                    {exam.title} ({exam.timeLimit} mins)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleStart}
          className="w-full h-12 text-lg font-medium shadow-lg transition-all"
        >
          Begin Assessment <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  // --- VIEW 2: TAKING THE EXAM ---
  if (step === "EXAM" && selectedExam) {
    const answeredCount = Object.keys(answers).length;
    const totalCount = selectedExam.questions.length;
    const progress = Math.round((answeredCount / totalCount) * 100);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md py-4 border-b shadow-sm -mx-6 px-6 md:-mx-10 md:px-10 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <span className="font-bold text-slate-800 text-lg">
              {selectedExam.title}
            </span>

            <div className="flex items-center gap-3">
              {/* ⏳ TIMER UI ADDED HERE */}
              {timeLeft !== null && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-sm transition-colors duration-300 border",
                    timeLeft <= 60
                      ? "bg-red-50 text-red-600 border-red-200 animate-pulse" // Turns red under 1 minute
                      : "bg-blue-50 text-blue-700 border-blue-200",
                  )}
                >
                  <Timer className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                {answeredCount} / {totalCount} Answered
              </span>
            </div>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-16 max-w-4xl mx-auto pb-10">
          {selectedExam.questions.map((q, index) => {
            const hasChoiceImages = q.choices.some((c) => c.imageUrl);

            return (
              <div
                key={q.id}
                className="scroll-mt-32 border-b pb-12 last:border-0"
                id={`question-${q.id}`}
              >
                {/* Question Section */}
                <div className="flex items-start gap-4 mb-6">
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="space-y-4 w-full">
                    <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
                      {q.text}
                    </h3>

                    {q.imageUrl && (
                      <div className="relative w-full h-48 md:h-72 bg-white rounded-lg border-2 border-slate-100 shadow-sm overflow-hidden p-2">
                        <Image
                          src={q.imageUrl}
                          alt="Diagram"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Choices Section */}
                <div
                  className={cn(
                    "grid gap-4 pl-12",
                    hasChoiceImages
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1",
                  )}
                >
                  {q.choices.map((c) => {
                    const isSelected = answers[q.id] === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: c.id }))
                        }
                        className={cn(
                          "relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group",
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50",
                        )}
                      >
                        {c.imageUrl && (
                          <div className="relative w-full h-24 mb-3 border rounded bg-white">
                            <Image
                              src={c.imageUrl}
                              alt={c.text}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-slate-300 group-hover:border-blue-400",
                            )}
                          >
                            {isSelected && (
                              <div className="h-2 w-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "text-lg font-medium",
                              isSelected ? "text-blue-900" : "text-slate-700",
                            )}
                          >
                            {c.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4 pt-8 border-t">
          {answeredCount < totalCount && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg text-sm font-medium">
              <AlertCircle className="h-4 w-4" /> You have{" "}
              {totalCount - answeredCount} unanswered questions.
            </div>
          )}
          <Button
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            size="lg"
            className="w-full md:w-auto min-w-50 h-14 text-lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Submit Assessment"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: DONE ---
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-in zoom-in duration-300 text-center">
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Assessment Submitted!
        </h2>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          Thank you, <strong>{firstName}</strong>. Your results have been
          recorded.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        className="mt-8"
      >
        Start New Session
      </Button>
    </div>
  );
}
