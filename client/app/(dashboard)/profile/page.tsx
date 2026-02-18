"use client";

import { toast } from "sonner";
import useSWR from "swr";
import { User } from "lucide-react";

import UpdateProfileDialog, { Profile } from "./_components/UpdateProfileDialog";
import { fetcher, request } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { env } from "@/utils/env";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";

export default function ProfilePage() {
  const url = `${env.NEXT_PUBLIC_API_URL}${API.user}`;

  const { data, isLoading, mutate } = useSWR<{ data: Profile }>(url, fetcher, {
    revalidateOnFocus: false,
    onError: () => toast.error("Failed to load profile"),
  });

  const profile = data?.data ?? null;

  const skeletonText = (width: string, height: string = "h-6") => (
    <Skeleton className={`${height} ${width} rounded-md`} />
  );

  const handleLogout = async () => {
    try {
      const res = await request(API.logout, "POST");
      if (!res.success) throw new Error(res.errMsg || "Failed to logout");
      toast.success("Logged out successfully");
      window.location.href = "/auth/login";
    } catch (err) {
      toast.error((err as Error).message || "Failed to logout");
    }
  };

  // Show consistent empty state if profile is not loaded and not loading
  if (!isLoading && !profile) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center space-y-4 py-6">
          <Empty>
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium text-gray-600">
              No profile found
            </p>
            <p className="text-gray-500 text-sm">
              Please login or reload the page
            </p>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-xl">
            {isLoading
              ? skeletonText("w-48", "h-6")
              : `Welcome${profile?.username ? `, ${profile.username}` : "!"}`}
          </CardTitle>
          <CardDescription>
            {isLoading ? skeletonText("w-72", "h-4") : (profile?.email ?? "")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-600">Full Name</div>
            {isLoading ? (
              skeletonText("w-full", "h-9")
            ) : (
              <div className="mt-2 text-base">{profile?.username}</div>
            )}
          </div>

          <div>
            <div className="text-sm font-medium text-gray-600">Email</div>
            {isLoading ? (
              skeletonText("w-full", "h-9")
            ) : (
              <div className="mt-2 text-base">{profile?.email}</div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          {isLoading ? (
            <>
              {skeletonText("w-24", "h-9")}
              {skeletonText("w-24", "h-9")}
            </>
          ) : (
            <>
              <UpdateProfileDialog
                profile={profile}
                onUpdate={(updated) => mutate({ data: updated }, false)}
              />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
