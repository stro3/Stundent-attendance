import ReportsView from "@/components/dashboard/reports-view";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view summarized attendance reports.
        </p>
      </div>
      <ReportsView />
    </div>
  );
}
