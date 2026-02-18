"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";
import { Empty } from "@/components/ui/empty";

import { request } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { UpdateUserProfileInput, updateUserProfileSchema } from "@/lib/schemas";

export type Profile = { username: string; email: string };

type UpdateProfileDialogProps = {
  profile: Profile | null;
  onUpdate?: (profile: Profile) => void;
};

export default function UpdateProfileDialog({
  profile,
  onUpdate,
}: UpdateProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserProfileInput>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: profile?.username || "",
      email: profile?.email || "",
    },
  });

  const onSubmit = (values: UpdateUserProfileInput) => {
    startTransition(async () => {
      if (!profile) return;

      const res = await request<{
        username: string;
        email: string;
        id: string;
      }>(
        API.updateProfile,
        "PUT",
        { data: values },
        "Failed to update profile",
      );

      if (!res.success) {
        toast.error(res.errMsg || "Failed to update profile");
        return;
      }

      toast.success(res.message || "Profile updated successfully");
      setOpen(false);

      const updated = res.data as { username: string; email: string };

      onUpdate?.(updated);
      form.reset(updated);
    });
  };

  // Empty state when profile is not loaded
  if (!profile) {
    return (
      <Empty className="text-center py-4">
        <User className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-gray-600">No profile found</p>
        <p className="text-gray-500 text-sm">Please login or reload the page</p>
      </Empty>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form
          id="update-profile-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                placeholder="Your username"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <FieldError>
                  {form.formState.errors.username.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>
          </FieldSet>
        </form>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button type="submit" form="update-profile-form" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
