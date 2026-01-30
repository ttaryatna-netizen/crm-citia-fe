"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddUserButton } from "@/components/marketing/add-user";

export default function Page() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between gap-4 items-center">
        <div className="flex flex-col">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            User List
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor your user here
          </p>
        </div>

        <AddUserButton onSuccess={() => setRefreshKey((prev) => prev + 1)} />
      </div>

      <DataTable columns={columns} refreshTrigger={refreshKey} />
    </div>
  );
}
