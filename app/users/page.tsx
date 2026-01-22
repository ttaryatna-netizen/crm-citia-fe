import { columns, User } from "./columns";
import { DataTable } from "./data-table";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { TriangleAlertIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface ApiResponse {
  status: string;
  data: User[];
}

async function getData(): Promise<{ data: User[], error: string | null }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Variable PUBLIC_API_URL is not defined in .env");
  }

  try {
    const res = await fetch(`${baseUrl}/api/users`, {
      cache: "no-store",
    });

    if (!res.ok) {
      try {
        const errorJson = await res.json();
        return {
          data: [],
          error: errorJson.error || `Gagal mengambil data (Status: ${res.status})`
        };
      } catch {
        return { data: [], error: `Terjadi kesalahan pada server (Status: ${res.status})` };
      }
    }

    const json: ApiResponse = await res.json();
    return { data: json.data, error: null };
  
  } catch (err) {
    console.error("Fetch error:", err);
    return { 
      data: [], 
      error: "Tidak dapat terhubung ke server Backend. Pastikan API sudah berjalan." 
    };
  }
}

export default async function Page() {
  const { data, error } = await getData();

  return (
    <div className="container mx-auto">
      {error && (
        <Alert className='flex items-center gap-3'>
          <Avatar className='rounded-md'>
            <AvatarFallback className='bg-destructive dark:bg-destructive/60 rounded-md text-white'>
              <TriangleAlertIcon className='size-4' />
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
