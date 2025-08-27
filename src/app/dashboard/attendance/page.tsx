import AttendanceForm from "@/components/dashboard/attendance-form";

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Take Attendance</h1>
        <p className="text-muted-foreground">
          Use facial recognition to mark student attendance automatically.
        </p>
      </div>
      <AttendanceForm />
    </div>
  );
}
