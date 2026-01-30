"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserMarketing } from "@/app/marketing/users/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  clientCategoryId: z.string().min(1, "Category must be selected"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .refine((val) => isValidPhoneNumber(val), {
      message: "Phone number is not valid for that country",
    }),
  email: z.string().email("Invalid email format").or(z.literal("")).optional(),
  company: z.string().min(1, "Company name is required"),
  title: z.string().optional(),
  personalInformation: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

export type UserFormData = Omit<UserFormValues, "clientCategoryId"> & {
  clientCategoryId: number;
};

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserMarketing | null;
  onSave: (data: UserFormData) => void;
}

type Category = {
  id: string;
  name: string;
};

export function UserForm({ open, onOpenChange, user, onSave }: UserFormProps) {
  const isEditMode = !!user;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      title: "",
      personalInformation: "",
      clientCategoryId: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          fullName: user.fullName,
          email: user.email || "",
          phone: user.phone,
          company: user.company,
          title: user.title || "",
          personalInformation: user.personalInformation || "",
          clientCategoryId: user.clientCategory?.id
            ? String(user.clientCategory.id)
            : "",
        });
      } else {
        form.reset({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          title: "",
          personalInformation: "",
          clientCategoryId: "",
        });
      }
    }
  }, [user, form, open]);

  useEffect(() => {
    if (open && categories.length === 0) {
      const fetchCategories = async () => {
        setLoadingCategory(true);
        try {
          const response = await fetch(
            `${baseUrl}/api/marketing/client-categories`,
          );
          const result = await response.json();
          setCategories(result.data || []);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          setLoadingCategory(false);
        }
      };
      fetchCategories();
    }
  }, [baseUrl, open, categories.length]);

  const onSubmit = (values: UserFormValues) => {
    const payload: UserFormData = {
      ...values,
      clientCategoryId: parseInt(values.clientCategoryId),
      email: values.email || "",
      title: values.title || "",
      personalInformation: values.personalInformation || "",
    };

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Make changes to the user profile here."
              : "Fill in the form to create a new user."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">Email</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Phone <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <PhoneInput
                        international
                        placeholder="Ex: +62 812 3456 7890"
                        defaultCountry="ID"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientCategoryId"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              loadingCategory ? "Loading..." : "Select Category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Company <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-center gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right">Title</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personalInformation"
              render={({ field }) => (
                <FormItem className="grid md:grid-cols-4 items-start gap-2 md:gap-4 space-y-0">
                  <FormLabel className="text-right pt-2">Info</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Save Changes" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
