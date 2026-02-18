"use client";

import Link from "next/link";
import {  buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col gap-4 items-center text-center">
          <CardTitle>Welcome to Your App</CardTitle>
          <CardDescription>
            A simple web app to manage your tasks. Login or register to get
            started.
          </CardDescription>

          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
