import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Page() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-col">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Campaign Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor your campaign here
          </p>
        </div>
      </div>

      <DataTable columns={columns} />
    </div>
  );
}
