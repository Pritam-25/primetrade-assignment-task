"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48 rounded-md" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72 rounded-md" />
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="col-span-1 flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>

          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
