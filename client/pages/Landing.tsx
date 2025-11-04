"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Bug,
  Code2,
  GitBranch,
  Shield,
  Zap,
  ChevronRight,
  Github,
  Settings,
  Key,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
<img
              src="/stack-seek-high-resolution-logo-transparent (6).png"
              alt="Stack Seek Logo"
              className="h-24 w-24 sm:h-32 sm:w-32 object-contain hover:scale-110 cursor-pointer transition-all duration-300"
            />
            
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm enhanced-button px-2 sm:px-3">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 professional-button enhanced-button text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
          <Zap className="h-3 w-3 animate-icon" />
          <span className="hidden sm:inline">
            Now with Multi-Provider Integration
          </span>
          <span className="sm:hidden">Multi-Provider Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
          Error Analysis
          <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
          Analyze, track, and resolve errors across your repositories with
          AI-powered insights. Connect GitHub, GitLab, Bitbucket, and Azure
          DevOps for intelligent error analysis.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 sm:mb-16 px-4">
          <Link to="/register">
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 sm:px-8 font-medium bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 professional-button enhanced-button text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Start Analyzing Errors</span>
              <span className="sm:hidden">Get Started</span>
              <ChevronRight className="ml-2 h-4 w-4 animate-icon" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-6 sm:px-8 font-medium enhanced-button text-sm sm:text-base"
            >
              Sign In
            </Button>
          </Link>
        </div>

        {/* Demo Dashboard */}
        <div className="max-w-5xl mx-auto px-4">
          <Card className="overflow-hidden border shadow-2xl bg-card/50 backdrop-blur">
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-icon" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Interactive Dashboard
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm px-2">
                  Real-time error analysis and insights
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-muted/30">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2">
            Everything you need for error analysis
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Comprehensive tools and integrations to streamline your error
            debugging workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">
                Multi-Provider Integration
              </CardTitle>
              <CardDescription className="leading-relaxed">
                Connect repositories from GitHub, GitLab, Bitbucket, and Azure
                DevOps with comprehensive authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">AI-Powered Analysis</CardTitle>
              <CardDescription className="leading-relaxed">
                Advanced error pattern recognition with intelligent suggestions
                for quick resolution and debugging.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">Enterprise Security</CardTitle>
              <CardDescription className="leading-relaxed">
                Bank-grade security with encrypted credential storage and secure
                authentication protocols.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">Real-time Dashboard</CardTitle>
              <CardDescription className="leading-relaxed">
                Monitor error trends, track resolution progress, and visualize
                repository health metrics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Key className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">Flexible Authentication</CardTitle>
              <CardDescription className="leading-relaxed">
                Support for tokens, SSH keys, deploy keys, and OAuth for
                seamless repository access.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border bg-background/50 backdrop-blur hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary animate-icon" />
              </div>
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
              <CardDescription className="leading-relaxed">
                Built on modern architecture with .NET backend for maximum
                performance and reliability.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-primary/80 text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
            Ready to streamline your error analysis?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed px-4">
            Join thousands of developers who are already saving hours every week
            with intelligent error insights
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto h-11 px-6 sm:px-8 font-medium bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 professional-button enhanced-button text-white text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Get Started for Free</span>
                <span className="sm:hidden">Get Started</span>
                <ChevronRight className="ml-2 h-4 w-4 animate-icon" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 sm:px-8 font-medium bg-white/10 border-white/20 hover:bg-white/20 text-white enhanced-button text-sm sm:text-base"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
<img
              src="/stack-seek-high-resolution-logo-transparent (1).png"
              alt="Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain hover:scale-110 cursor-pointer transition-all duration-300"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-blue-400">StackSeek</h3>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 text-sm">
            <a 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              About
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              href="/blog" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Blog
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              href="/careers" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Careers
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              href="/contact" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 text-sm">
            <a 
              href="/privacy-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              href="/terms-of-service" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service
            </a>
            <span className="text-muted-foreground">•</span>
            <a 
              href="/cookie-policy" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>

          <p className="text-center text-muted-foreground text-sm px-4">
            © 2025 StackSeek. Built with modern technologies for modern
            developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
