import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { TriangleAlertIcon } from 'lucide-react'

interface ApiResponse {
  status: string;
  data: User[];
}

async function getData(): Promise<User[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Variable PUBLIC_API_URL is not defined in .env");
  }

  const res = await fetch(`${baseUrl}/api/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const json: ApiResponse = await res.json();

  return json.data;
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
