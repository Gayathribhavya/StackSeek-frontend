"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bug, Home, Search } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Bug className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">StackSeek</span>
        </Link>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full enhanced-button">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full enhanced-button">
                  <Search className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
