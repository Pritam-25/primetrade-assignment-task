"use client";

import React, { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldSet } from "@/components/ui/field";

import { request } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { env } from "@/utils/env";
import { mutate } from "swr";
import { createTaskSchema, updateTaskSchema } from "@/lib/schemas";
import type { CreateTaskInput, UpdateTaskInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Task } from "@/app/(dashboard)/tasks/_components/taskTable";

type CreateTaskDialogProps = {
  // pass `undefined` to render the default Add button, pass a React node to use a custom trigger,
  // or pass `null` to render no trigger at all (useful when controlling open externally).
  trigger?: React.ReactNode | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialValues?: {
    id?: string;
    title?: string;
    description?: string;
    status?: "PENDING" | "COMPLETED";
  };
  mode?: "create" | "edit";
};

export function CreateTaskDialog({
  trigger,
  open: openProp,
  onOpenChange,
  initialValues,
  mode = "create",
}: CreateTaskDialogProps) {
  const router = useRouter();
  const [openState, setOpenState] = useState(false);
  const open = typeof openProp === "boolean" ? openProp : openState;
  const setOpen = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    if (typeof openProp !== "boolean") setOpenState(v);
  };

  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTaskInput | UpdateTaskInput>({
    resolver: zodResolver(
      mode === "create" ? createTaskSchema : updateTaskSchema,
    ),
    defaultValues: { title: "", description: "", status: "PENDING" },
  });

  // reset form when initialValues change (for edit)
  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        title: initialValues.title ?? "",
        description: initialValues.description ?? "",
        status: initialValues.status ?? "PENDING",
      });
    } else if (mode === "create") {
      form.reset({ title: "", description: "" });
    }
  }, [initialValues]);

  const onSubmit = (values: CreateTaskInput | UpdateTaskInput) => {
    startTransition(async () => {
      if (mode === "create") {
        const res = await request<{ task: Task }>(
          API.createTask,
          "POST",
          // ensure create does not send status (backend will default to PENDING)
          { data: { title: values.title, description: values.description } },
          "Failed to create task",
        );

        if (!res.success) {
          toast.error(res.errMsg);
          return;
        }

        toast.success(res.message || "Task created");
        setOpen(false);
        // refresh to revalidate Next data and also revalidate SWR cache
        router.refresh();
        mutate(env.NEXT_PUBLIC_API_URL + API.getTasks);
        return;
      }

      // edit mode
      if (mode === "edit" && initialValues?.id) {
        const res = await request<{ task: Task }>(
          "updateTask",
          "PUT",
          { data: values, params: { id: initialValues.id } },
          "Failed to update task",
        );

        if (!res.success) {
          toast.error(res.errMsg);
          return;
        }

        toast.success(res.message || "Task updated");
        setOpen(false);
        // refresh to revalidate Next data and also revalidate SWR cache
        router.refresh();
        mutate(env.NEXT_PUBLIC_API_URL + API.getTasks);
        return;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger === undefined ? (
        <DialogTrigger asChild>
          <Button className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            <span>Add task</span>
          </Button>
        </DialogTrigger>
      ) : trigger !== null ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : null}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Task" : "Update Task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new task — provide a title and optional description."
              : "Update the task — you can change title, description and status."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-task-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-2"
        >
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Task title"
                {...form.register("title")}
                disabled={isPending}
              />
              {form.formState.errors.title && (
                <FieldError>
                  {form.formState.errors.title.message as string}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                id="description"
                placeholder="Optional description"
                disabled={isPending}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                )}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <FieldError>
                  {form.formState.errors.description.message as string}
                </FieldError>
              )}
            </Field>
            {mode === "edit" && (
              <Field>
                <FieldLabel>Status</FieldLabel>

                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            )}
          </FieldSet>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button type="submit" form="create-task-form" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </span>
            ) : mode === "create" ? (
              "Create"
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
