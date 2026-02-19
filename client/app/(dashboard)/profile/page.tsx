"use client";

import { toast } from "sonner";
import useSWR from "swr";
import { User } from "lucide-react";

import UpdateProfileDialog, {
  Profile,
} from "./_components/UpdateProfileDialog";
import ProfileSkeleton from "./_components/ProfileSkeleton";
import { fetcher, request } from "@/lib/fetcher";
import { API } from "@/lib/api";
import { env } from "@/utils/env";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";

export default function ProfilePage() {
  const url = `${env.NEXT_PUBLIC_API_URL}${API.user}`;

  const { data, isLoading, mutate } = useSWR<{ data: Profile }>(url, fetcher, {
    revalidateOnFocus: false,
    onError: () => toast.error("Failed to load profile"),
  });

  const profile = data?.data ?? null;

  const handleLogout = async () => {
    try {
      const res = await request(API.logout, "POST");
      if (!res.success) throw new Error(res.errMsg || "Failed to logout");
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error((err as Error).message || "Failed to logout");
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  // Show consistent empty state when profile isn't present
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="text-center space-y-4 py-6">
          <Empty>
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium">No profile found</p>
            <p className="text-sm">Please login or reload the page</p>
          </Empty>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-muted rounded-full h-16 w-16 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profile.username}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UpdateProfileDialog
                profile={profile}
                onUpdate={(updated) => mutate({ data: updated }, false)}
              />
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
                <CardDescription>
                  Personal information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </div>
                    <div className="mt-1 text-base">{profile.username}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Email
                    </div>
                    <div className="mt-1 text-base">{profile.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
