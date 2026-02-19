"use client";

import { toast } from "sonner";
import TaskTable, { type Task } from "./_components/taskTable";
import { fetcher } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { env } from "@/utils/env";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaskSkeleton from "./_components/taskSkeleton";

export default function TasksPage() {
  const url = process.env.NEXT_PUBLIC_API_URL + API.getTasks;
  // Use SWR to fetch the profile
  const { data, isLoading } = useSWR<{ data: Task[] }>(url, fetcher, {
    revalidateOnFocus: false, // optional: don't refetch when window focuses
    onError: (err) => {
      toast.error("Failed to load tasks");
      console.error(err);
    },
  });

  // Normalize server status (e.g. "PENDING"/"COMPLETED") to lowercase used by UI
  const tasks: Task[] = (data?.data ?? []).map((t: any) => ({
    ...t,
    status: (t.status ?? "PENDING").toString().toLowerCase(),
  }));

  if (isLoading) {
    // Skeleton placeholder for table while loading
    return <TaskSkeleton />;
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
