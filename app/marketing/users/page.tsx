import { columns, UserMarketing } from "./columns";
import { DataTable } from "./data-table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TriangleAlertIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { AddUserButton } from "@/components/marketing/add-user";

interface ApiResponse {
  status: string;
  data: UserMarketing[];
}

// async function getData(): Promise<{ data: UserMarketing[]; error: string | null }> {
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL;

//   if (!baseUrl) {
//     throw new Error("Variable PUBLIC_API_URL is not defined in .env");
//   }

//   try {
//     const res = await fetch(`${baseUrl}/api/users`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       try {
//         const errorJson = await res.json();
//         return {
//           data: [],
//           error:
//             errorJson.error || `Gagal mengambil data (Status: ${res.status})`,
//         };
//       } catch {
//         return {
//           data: [],
//           error: `Terjadi kesalahan pada server (Status: ${res.status})`,
//         };
//       }
//     }

//     const json: ApiResponse = await res.json();
//     return { data: json.data, error: null };
//   } catch (err) {
//     console.error("Fetch error:", err);
//     return {
//       data: [],
//       error:
//         "Tidak dapat terhubung ke server Backend. Pastikan API sudah berjalan.",
//     };
//   }
// }

const DUMMY_USERS: UserMarketing[] = [
  {
    id: "user-1",
    name: "Alfien",
    type: "Pertamina",
  },
  {
    id: "user-2",
    name: "Sukma",
    type: "Partner",
  },
  {
    id: "user-3",
    name: "Prawira",
    type: "Pertamina",
  },
];

async function getData(): Promise<{
  data: UserMarketing[];
  error: string | null;
}> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: DUMMY_USERS,
    error: null,
  };
}

export default async function Page() {
  const { data, error } = await getData();

  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-col">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Users
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor your user here
          </p>
        </div>
        <AddUserButton />
      </div>

      {error && (
        <Alert className="flex items-center gap-3">
          <Avatar className="rounded-md">
            <AvatarFallback className="bg-destructive dark:bg-destructive/60 rounded-md text-white">
              <TriangleAlertIcon className="size-4" />
            </AvatarFallback>
          </Avatar>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DataTable columns={columns} data={data} />
    </div>
  );
}
