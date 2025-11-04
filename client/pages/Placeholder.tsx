"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bug, LogOut, ArrowLeft, Construction } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bug className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">StackSeek</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            {user && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>
                This page is coming soon. We're working hard to bring you this
                feature!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Continue prompting to have the AI assistant build out this page
                for you.
              </p>
              <div className="flex gap-2">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full enhanced-button">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/error-analysis" className="flex-1">
                  <Button className="w-full enhanced-button">Try Error Analysis</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
