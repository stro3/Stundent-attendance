import AttendanceLogsTable from "@/components/dashboard/attendance-logs-table";

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Attendance Logs</h1>
        <p className="text-muted-foreground">
          View and manage historical attendance records.
        </p>
      </div>
      <AttendanceLogsTable />
    </div>
  );
}
