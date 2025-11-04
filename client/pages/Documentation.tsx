import { ArrowLeft, BookOpen, Code, Search, Zap, GitBranch, Shield, FileText, Terminal, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Lightbulb className="h-5 w-5" />,
      content: `
        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-4">Welcome to StackSeek</h2>
            <p class="text-base text-muted-foreground leading-relaxed">
              StackSeek is an AI-powered error analysis platform designed to revolutionize how developers debug and write code. 
              Our intelligent system analyzes your errors in real-time, providing contextual solutions and preventing future issues. 
              This comprehensive documentation will guide you through every feature and capability.
            </p>
          </div>
          
          <div class="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Quick Start Guide
            </h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h4 class="font-semibold text-foreground">Create Your Account</h4>
                  <p class="text-sm text-muted-foreground">Sign up for your free StackSeek account and get instant access to AI-powered debugging</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h4 class="font-semibold text-foreground">Connect Your Repositories</h4>
                  <p class="text-sm text-muted-foreground">Link your GitHub, GitLab, Bitbucket, or Azure DevOps repositories for contextual analysis</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h4 class="font-semibold text-foreground">Analyze Your Errors</h4>
                  <p class="text-sm text-muted-foreground">Paste error messages, stack traces, or describe issues to get instant AI-powered solutions</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <h4 class="font-semibold text-foreground">Implement Solutions</h4>
                  <p class="text-sm text-muted-foreground">Apply step-by-step fixes and code suggestions to resolve issues quickly</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-4">System Requirements</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="border rounded-lg p-4">
                <h4 class="font-medium text-foreground mb-2">Browser Support</h4>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• Chrome 90+ (Recommended)</li>
                  <li>• Firefox 88+</li>
                  <li>• Safari 14+</li>
                  <li>• Edge 90+</li>
                </ul>
              </div>
              <div class="border rounded-lg p-4">
                <h4 class="font-medium text-foreground mb-2">Prerequisites</h4>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• Stable internet connection</li>
                  <li>• Git repository access (optional)</li>
                  <li>• Valid email address</li>
                  <li>• JavaScript enabled</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "error-analysis",
      title: "Error Analysis",
      icon: <Zap className="h-5 w-5" />,
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-4">AI-Powered Error Analysis</h2>
            <p class="text-base text-muted-foreground leading-relaxed">
              StackSeek's revolutionary error analysis engine combines advanced machine learning algorithms with extensive 
              pattern recognition to deliver contextual debugging solutions. Our AI understands your code's intent and 
              provides intelligent recommendations tailored to your specific development environment.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Supported Error Categories</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border border-red-200 dark:border-red-800/30 rounded-lg p-5 bg-red-50/50 dark:bg-red-950/10">
                <h4 class="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Runtime Errors
                </h4>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>NullPointerException:</strong> Null reference access</li>
                  <li>• <strong>TypeError:</strong> Type mismatch operations</li>
                  <li>• <strong>IndexOutOfBounds:</strong> Array/list boundary violations</li>
                  <li>• <strong>ReferenceError:</strong> Undefined variable access</li>
                </ul>
              </div>
              
              <div class="border border-orange-200 dark:border-orange-800/30 rounded-lg p-5 bg-orange-50/50 dark:bg-orange-950/10">
                <h4 class="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Compilation Errors
                </h4>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Syntax Errors:</strong> Code structure violations</li>
                  <li>• <strong>Import Errors:</strong> Missing or incorrect dependencies</li>
                  <li>• <strong>Type Mismatches:</strong> Static type violations</li>
                  <li>• <strong>Declaration Issues:</strong> Variable/function conflicts</li>
                </ul>
              </div>
              
              <div class="border border-blue-200 dark:border-blue-800/30 rounded-lg p-5 bg-blue-50/50 dark:bg-blue-950/10">
                <h4 class="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                  </svg>
                  Logic & Performance
                </h4>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Infinite Loops:</strong> Recursive/iterative issues</li>
                  <li>• <strong>Memory Leaks:</strong> Resource management problems</li>
                  <li>• <strong>Algorithm Issues:</strong> Incorrect implementations</li>
                  <li>• <strong>Performance Bottlenecks:</strong> Optimization opportunities</li>
                </ul>
              </div>
              
              <div class="border border-green-200 dark:border-green-800/30 rounded-lg p-5 bg-green-50/50 dark:bg-green-950/10">
                <h4 class="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd"/>
                  </svg>
                  Integration Errors
                </h4>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>API Failures:</strong> HTTP request/response issues</li>
                  <li>• <strong>Database Errors:</strong> Connection and query problems</li>
                  <li>• <strong>Network Timeouts:</strong> Connectivity failures</li>
                  <li>• <strong>Authentication Issues:</strong> Authorization problems</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-primary/5 to-secondary/5 border rounded-lg p-6">
            <h3 class="text-xl font-semibold text-foreground mb-4">How Our AI Analysis Works</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span class="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-1">Input Processing</h4>
                    <p class="text-sm text-muted-foreground">Advanced parsing of error messages, stack traces, and code context</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span class="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-1">Context Analysis</h4>
                    <p class="text-sm text-muted-foreground">Deep understanding of your codebase structure and dependencies</p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span class="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-1">Pattern Matching</h4>
                    <p class="text-sm text-muted-foreground">Comparison against millions of solved error patterns</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span class="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-1">Solution Generation</h4>
                    <p class="text-sm text-muted-foreground">Tailored fixes with code suggestions and implementation steps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-4">Optimization Best Practices</h3>
            <div class="space-y-4">
              <div class="border-l-4 border-primary pl-4">
                <h4 class="font-medium text-foreground mb-1">Provide Complete Information</h4>
                <p class="text-sm text-muted-foreground">Include full stack traces, relevant code snippets, and environment details for accurate analysis</p>
              </div>
              <div class="border-l-4 border-primary pl-4">
                <h4 class="font-medium text-foreground mb-1">Specify Context Details</h4>
                <p class="text-sm text-muted-foreground">Mention programming language, framework versions, and what you were attempting when the error occurred</p>
              </div>
              <div class="border-l-4 border-primary pl-4">
                <h4 class="font-medium text-foreground mb-1">Use Repository Integration</h4>
                <p class="text-sm text-muted-foreground">Connected repositories enable contextual analysis based on your actual codebase structure</p>
              </div>
              <div class="border-l-4 border-primary pl-4">
                <h4 class="font-medium text-foreground mb-1">Describe Expected Behavior</h4>
                <p class="text-sm text-muted-foreground">Explain what you expected to happen versus what actually occurred for better solution targeting</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "repository-integration",
      title: "Repository Integration",
      icon: <GitBranch className="h-5 w-5" />,
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-4">Repository Integration</h2>
            <p class="text-base text-muted-foreground leading-relaxed">
              Unlock the full potential of StackSeek by connecting your repositories. Our deep integration capabilities 
              provide context-aware error analysis, automated insights, and personalized debugging recommendations 
              based on your actual codebase structure and patterns.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Supported Platforms</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white dark:text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">GitHub</h4>
                    <p class="text-sm text-muted-foreground">Most popular Git platform</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• Public and private repositories</li>
                  <li>• GitHub Enterprise support</li>
                  <li>• Organization repositories</li>
                  <li>• Fine-grained access control</li>
                </ul>
              </div>
              
              <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.65 12c0-5.46-4.39-9.9-9.82-9.9C7.5 2.1 3.15 6.44 3.15 12c0 5.46 4.39 9.9 9.82 9.9 5.5 0 9.68-4.44 9.68-9.9zM8.93 17.76c-.45 0-.82-.36-.82-.82s.37-.82.82-.82.82.36.82.82-.37.82-.82.82zm2.86-2.23c-.45 0-.82-.36-.82-.82s.37-.82.82-.82.82.36.82.82-.36.82-.82.82zm2.86-2.23c-.45 0-.82-.36-.82-.82s.37-.82.82-.82.82.36.82.82-.37.82-.82.82z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">GitLab</h4>
                    <p class="text-sm text-muted-foreground">DevOps platform</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• GitLab.com and self-hosted</li>
                  <li>• CI/CD integration</li>
                  <li>• Group-level repositories</li>
                  <li>• Custom deployment keys</li>
                </ul>
              </div>
              
              <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.499.515.867 1.022.87a1.01 1.01 0 00.593-.188L12 17.296l7.112 5.301a1.01 1.01 0 00.593.188 1.01 1.01 0 001.022-.87L23.99 2.105a.768.768 0 00-.768-.892H.778z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">Bitbucket</h4>
                    <p class="text-sm text-muted-foreground">Atlassian Git solution</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• Cloud and server versions</li>
                  <li>• Jira integration</li>
                  <li>• Team repositories</li>
                  <li>• App passwords support</li>
                </ul>
              </div>
              
              <div class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 12a12 12 0 1124 0 12 12 0 01-24 0zm6.168-6.928L8.4 7.344l-4.6 1.928a7.2 7.2 0 014.368-3.2zm11.664 0a7.2 7.2 0 014.368 3.2L17.6 7.344l2.232-2.272zm-5.832 2.304a7.2 7.2 0 010 5.248L9.168 9.376a7.2 7.2 0 012.832-1.1zm0 0"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">Azure DevOps</h4>
                    <p class="text-sm text-muted-foreground">Microsoft DevOps platform</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-1">
                  <li>• Azure Repos integration</li>
                  <li>• Enterprise authentication</li>
                  <li>• Project-level access</li>
                  <li>• Personal access tokens</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border rounded-lg p-6">
            <h3 class="text-xl font-semibold text-foreground mb-4">Connection Process</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p class="text-sm text-muted-foreground"><strong>Navigate to Integration:</strong> Access the "Connect Repository" page from your dashboard</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p class="text-sm text-muted-foreground"><strong>Select Provider:</strong> Choose from GitHub, GitLab, Bitbucket, or Azure DevOps</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p class="text-sm text-muted-foreground"><strong>Authorize Access:</strong> Grant StackSeek read-only permissions to your repositories</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p class="text-sm text-muted-foreground"><strong>Select Repositories:</strong> Choose specific repositories for analysis</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <p class="text-sm text-muted-foreground"><strong>Configure Settings:</strong> Set up analysis preferences and notification options</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Privacy & Security Guarantees</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">Read-Only Access</h4>
                    <p class="text-sm text-muted-foreground">We only request read permissions - never write access to your repositories</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">No Permanent Storage</h4>
                    <p class="text-sm text-muted-foreground">Your source code is never stored permanently on our servers</p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">Isolated Processing</h4>
                    <p class="text-sm text-muted-foreground">Analysis happens in secure, isolated environments with automatic cleanup</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-medium text-foreground">Easy Revocation</h4>
                    <p class="text-sm text-muted-foreground">Revoke access anytime through your Git provider or StackSeek settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border-l-4 border-primary bg-primary/5 rounded-r-lg p-6">
            <h3 class="text-lg font-semibold text-foreground mb-4">Integration Benefits</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Context-aware error analysis using your actual codebase structure</li>
                <li>• Automatic detection of coding patterns, frameworks, and dependencies</li>
                <li>• Personalized recommendations based on your development style</li>
              </ul>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Historical error tracking and pattern analysis over time</li>
                <li>• Integration with your existing development workflow</li>
                <li>• Enhanced debugging precision with repository context</li>
              </ul>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "programming-languages",
      title: "Programming Languages",
      icon: <Code className="h-5 w-5" />,
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-4">Universal Language Support</h2>
            <p class="text-base text-muted-foreground leading-relaxed">
              StackSeek provides comprehensive error analysis across all major programming languages, frameworks, and development environments. 
              Our AI models are trained on diverse codebases to understand language-specific patterns, idioms, and common pitfalls.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Language Support</h3>
            <div class="bg-gradient-to-r from-primary/10 to-secondary/10 border rounded-lg p-6">
              <p class="text-base text-muted-foreground leading-relaxed mb-4">
                StackSeek provides comprehensive error analysis and debugging support for <strong>all programming languages</strong>. 
                Our advanced AI models are trained on diverse codebases and can understand syntax, patterns, and common issues across any programming language you're working with.
              </p>
              <div class="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <h4 class="font-medium text-foreground mb-2">What we analyze:</h4>
                  <ul class="space-y-1">
                    <li>• Runtime and compilation errors</li>
                    <li>• Syntax and semantic issues</li>
                    <li>• Performance bottlenecks</li>
                    <li>• Best practice recommendations</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-foreground mb-2">Language-agnostic support:</h4>
                  <ul class="space-y-1">
                    <li>• Modern and legacy versions</li>
                    <li>• Framework-specific patterns</li>
                    <li>• Cross-platform compatibility</li>
                    <li>• Ecosystem integration issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Framework Expertise</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border rounded-lg p-6">
                <h4 class="font-bold text-foreground mb-4 flex items-center gap-2">
                  <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  Frontend Frameworks
                </h4>
                <div class="space-y-3">
                  <div>
                    <h5 class="font-medium text-foreground text-sm">React Ecosystem</h5>
                    <p class="text-xs text-muted-foreground">Next.js, Gatsby, Create React App, hooks debugging</p>
                  </div>
                  <div>
                    <h5 class="font-medium text-foreground text-sm">Vue.js</h5>
                    <p class="text-xs text-muted-foreground">Vue 3, Nuxt.js, Composition API, reactivity issues</p>
                  </div>
                  <div>
                    <h5 class="font-medium text-foreground text-sm">Angular</h5>
                    <p class="text-xs text-muted-foreground">Angular 12+, dependency injection, RxJS operators</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border rounded-lg p-6">
                <h4 class="font-bold text-foreground mb-4 flex items-center gap-2">
                  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Backend Frameworks
                </h4>
                <div class="space-y-3">
                  <div>
                    <h5 class="font-medium text-foreground text-sm">Spring Framework</h5>
                    <p class="text-xs text-muted-foreground">Spring Boot, Security, Data JPA, configuration issues</p>
                  </div>
                  <div>
                    <h5 class="font-medium text-foreground text-sm">Django & Flask</h5>
                    <p class="text-xs text-muted-foreground">ORM queries, middleware, authentication, deployment</p>
                  </div>
                  <div>
                    <h5 class="font-medium text-foreground text-sm">Express.js</h5>
                    <p class="text-xs text-muted-foreground">Middleware chains, routing, error handling, async issues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: <Shield className="h-5 w-5" />,
      content: `
        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-foreground mb-4">Enterprise-Grade Security</h2>
            <p class="text-base text-muted-foreground leading-relaxed">
              Your code security and privacy are fundamental to our service. StackSeek implements military-grade security measures 
              and follows industry best practices to ensure your intellectual property remains protected throughout the analysis process.
            </p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Data Protection Measures</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border border-green-200 dark:border-green-800/30 rounded-lg p-6 bg-green-50/50 dark:bg-green-950/10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">End-to-End Encryption</h4>
                    <p class="text-sm text-muted-foreground">TLS 1.3 in transit, AES-256 at rest</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>All data transmissions use industry-standard encryption protocols</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Encrypted storage with regular key rotation and secure key management</span>
                  </li>
                </ul>
              </div>
              
              <div class="border border-blue-200 dark:border-blue-800/30 rounded-lg p-6 bg-blue-50/50 dark:bg-blue-950/10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">Zero Retention Policy</h4>
                    <p class="text-sm text-muted-foreground">No permanent code storage</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Source code is processed in memory and immediately discarded</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Analysis results retained only for the duration you specify</span>
                  </li>
                </ul>
              </div>
              
              <div class="border border-purple-200 dark:border-purple-800/30 rounded-lg p-6 bg-purple-50/50 dark:bg-purple-950/10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">Isolated Processing</h4>
                    <p class="text-sm text-muted-foreground">Containerized analysis environments</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Each analysis runs in a secure, isolated Docker container</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Automatic cleanup and environment reset after processing</span>
                  </li>
                </ul>
              </div>
              
              <div class="border border-orange-200 dark:border-orange-800/30 rounded-lg p-6 bg-orange-50/50 dark:bg-orange-950/10">
                <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground">Access Controls</h4>
                    <p class="text-sm text-muted-foreground">Granular permission management</p>
                  </div>
                </div>
                <ul class="text-sm text-muted-foreground space-y-2">
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>OAuth 2.0 integration with major Git providers</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Read-only repository access with selective permission scopes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border rounded-lg p-8">
            <h3 class="text-xl font-semibold text-foreground mb-6 text-center">Compliance & Certifications</h3>
            <div class="grid md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-white font-bold text-sm">SOC 2</span>
                </div>
                <h4 class="font-medium text-foreground mb-2">SOC 2 Type II</h4>
                <p class="text-xs text-muted-foreground">Audited security controls and operational procedures</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-white font-bold text-sm">GDPR</span>
                </div>
                <h4 class="font-medium text-foreground mb-2">GDPR Compliant</h4>
                <p class="text-xs text-muted-foreground">European data protection regulations compliance</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-white font-bold text-sm">CCPA</span>
                </div>
                <h4 class="font-medium text-foreground mb-2">CCPA Ready</h4>
                <p class="text-xs text-muted-foreground">California privacy protection standards</p>
              </div>
              <div class="text-center">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span class="text-white font-bold text-xs">ISO</span>
                </div>
                <h4 class="font-medium text-foreground mb-2">ISO 27001</h4>
                <p class="text-xs text-muted-foreground">International security management standards</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold text-foreground mb-6">Enterprise Security Features</h3>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-2">Single Sign-On (SSO)</h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">SAML 2.0 and OpenID Connect integration with enterprise identity providers like Active Directory, Okta, and Auth0</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1V8z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-2">Comprehensive Audit Logs</h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">Complete activity tracking and monitoring with detailed logs for security reviews and compliance requirements</p>
                  </div>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-2">IP Whitelisting</h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">Restrict platform access to specific IP ranges or geographic regions for enhanced security control</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                    <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-foreground mb-2">Private Cloud Deployment</h4>
                    <p class="text-sm text-muted-foreground leading-relaxed">On-premises or private cloud installation options for organizations with strict data residency requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-foreground mb-2">Your Rights & Control</h4>
                <p class="text-sm text-muted-foreground leading-relaxed mb-4">
                  You maintain complete control over your data and can exercise your rights at any time through our platform or by contacting our privacy team.
                </p>
                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                  <ul class="space-y-1 text-muted-foreground">
                    <li>• Access and export all your data</li>
                    <li>• Delete your account and all associated data</li>
                    <li>• Revoke repository access permissions</li>
                  </ul>
                  <ul class="space-y-1 text-muted-foreground">
                    <li>• Control data retention policies</li>
                    <li>• Receive data breach notifications</li>
                    <li>• Request detailed privacy reports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 sm:px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToHome} variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 hover:bg-accent/50">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            StackSeek Documentation
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
            Complete guide to using StackSeek for AI-powered error analysis and debugging. 
            Learn how to integrate your repositories, analyze errors, and improve your code quality.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{sections.length} Sections</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>All Languages</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="w-full justify-start gap-2 text-sm"
                  >
                    {section.icon}
                    {section.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {filteredSections.map((section) => (
                <Card 
                  key={section.id} 
                  id={section.id}
                  className={`transition-all duration-300 ${activeSection === section.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold">{section.title}</CardTitle>
                        <Badge variant="outline" className="mt-2">Documentation</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <div 
                      className="max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredSections.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No documentation found</h3>
                <p className="text-muted-foreground">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/final-transparent-logo.png"
              alt="Stack Seek Logo"
              className="h-10 sm:h-12 w-auto"
            />
          </div>
          <p className="text-center text-muted-foreground text-sm">
            © 2025 StackSeek. Built with modern technologies for modern developers.
          </p>
        </div>
      </footer>
    </div>
  );
}