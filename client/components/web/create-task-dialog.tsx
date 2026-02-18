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
import { createOrUpdateTaskSchema } from "@/lib/schemas";
import type { CreateTaskInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function CreateTaskDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createOrUpdateTaskSchema),
    defaultValues: { title: "", description: "", status: "PENDING" },
  });

  const onSubmit = (values: CreateTaskInput) => {
    startTransition(async () => {
      const res = await request<{ task: any }>(
        API.createTask,
        "POST",
        { data: values },
        "Failed to create task",
      );

      if (!res.success) {
        toast.error(res.errMsg);
        return;
      }

      toast.success(res.message || "Task created");
      setOpen(false);
      router.replace("/tasks");
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-2" size="sm">
          <Plus className="h-4 w-4" />
          <span>Add task</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task — provide a title and optional description.
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
                Creating...
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
