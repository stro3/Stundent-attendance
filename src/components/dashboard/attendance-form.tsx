"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { markAttendanceWithFaceRecognition, MarkAttendanceOutput } from "@/ai/flows/mark-attendance-with-face-recognition";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, UserCheck, UserX, AlertTriangle, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AttendanceRecord } from "@/lib/types";
import { ALL_STUDENTS } from "@/lib/data";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

export default function AttendanceForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MarkAttendanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>("attendanceRecords", []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ variant: "destructive", title: "No file selected", description: "Please select an image file." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const response = await markAttendanceWithFaceRecognition({ photoDataUri });
        setResult(response);
      } catch (err) {
        setError("Failed to process the image. Please try again.");
        toast({ variant: "destructive", title: "AI Error", description: "The AI model could not process the request." });
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleSaveAttendance = () => {
    if (!result) return;
    const today = format(new Date(), 'yyyy-MM-dd');

    const newRecords: AttendanceRecord[] = ALL_STUDENTS.map(student => {
      const isPresent = result.attendedStudents.some(attendedStudent => 
        student.name.toLowerCase() === attendedStudent.toLowerCase()
      );
      return {
        date: today,
        studentId: student.id,
        status: isPresent ? "Present" : "Absent",
      };
    });

    const otherDayRecords = attendanceRecords.filter(rec => rec.date !== today);
    setAttendanceRecords([...otherDayRecords, ...newRecords]);

    toast({
      title: "Attendance Saved!",
      description: `Attendance for ${today} has been recorded.`,
      action: <PartyPopper className="text-green-500" />,
    });
    setResult(null);
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Classroom Photo</CardTitle>
          <CardDescription>Select a photo of the students present in the classroom.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
            {preview ? (
              <Image src={preview} alt="Classroom preview" width={200} height={200} className="max-h-full w-auto object-contain rounded-md" data-ai-hint="classroom students" />
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Drag & drop or click to upload</p>
              </>
            )}
          </div>
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleSubmit} disabled={!file || isLoading} className="w-full">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            {isLoading ? "Analyzing..." : "Mark Attendance"}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Results</CardTitle>
          <CardDescription>Review the AI-generated attendance before saving.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
              <p>The AI is identifying students...</p>
              <p className="text-xs">This may take a moment.</p>
            </div>
          )}
          {error && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}
          {result && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center mb-2"><UserCheck className="mr-2 text-green-500" />Attended Students ({result.attendedStudents.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {result.attendedStudents.map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                   {result.attendedStudents.length === 0 && <p className="text-sm text-muted-foreground">No students identified as present.</p>}
                </div>
              </div>
              <Separator />
               <div>
                <h3 className="font-semibold flex items-center mb-2"><UserX className="mr-2 text-orange-500" />Unidentified Faces ({result.unidentifiedStudents.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {result.unidentifiedStudents.map((name, i) => <Badge key={i} variant="outline" className="border-orange-500/50 text-orange-600">{name}</Badge>)}
                   {result.unidentifiedStudents.length === 0 && <p className="text-sm text-muted-foreground">No unidentified faces found.</p>}
                </div>
              </div>
              <Button onClick={handleSaveAttendance} className="w-full mt-4">Save Attendance</Button>
            </div>
          )}
          {!isLoading && !error && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <p>Upload a photo and click "Mark Attendance" to see the results here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
