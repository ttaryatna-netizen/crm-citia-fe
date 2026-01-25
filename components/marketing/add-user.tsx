"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { UserForm } from "@/components/marketing/user-form";
import { useRouter } from "next/navigation";

export type UserFormData = {
  name: string;
  type: string;
};

export function AddUserButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCreateUser = async (formData: UserFormData) => {
    console.log("Creating new user:", formData);
    // await fetch('/api/users', { method: 'POST', body: ... })
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Add User <UserPlusIcon className="ml-2 h-4 w-4" />
      </Button>

      <UserForm open={open} onOpenChange={setOpen} onSave={handleCreateUser} />
    </>
  );
}
