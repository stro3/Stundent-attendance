import StudentManagement from "@/components/dashboard/student-management";

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Manage Students</h1>
        <p className="text-muted-foreground">
          Add, view, and manage student information.
        </p>
      </div>
      <StudentManagement />
    </div>
  );
}
