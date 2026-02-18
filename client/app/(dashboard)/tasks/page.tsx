"use client";

import { toast } from "sonner";
import TaskTable, { type Task } from "./_components/taskTable";
import { fetcher } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/utils/env";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TasksPage() {
  const url = env.NEXT_PUBLIC_API_URL + API.getTasks;
  // Use SWR to fetch the profile
  const { data, isLoading } = useSWR<{ data: Task[] }>(url, fetcher, {
    revalidateOnFocus: false, // optional: don't refetch when window focuses
    onError: (err) => {
      toast.error("Failed to load tasks");
      console.error(err);
    },
  });

  const tasks = data?.data ?? [];

  if (isLoading) {
    // Skeleton placeholder for table while loading
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>Manage your tasks and stay organized</CardDescription>
      </CardHeader>
      <CardContent>
        <TaskTable tasks={tasks} />
      </CardContent>
    </Card>
  );
}
