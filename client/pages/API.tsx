import { ArrowLeft, Code, Terminal, Key, Zap, Shield, FileText, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function API() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      id: "analyze-error",
      method: "POST",
      path: "/api/v1/analyze",
      title: "Analyze Error",
      description: "Analyze error messages and stack traces using AI",
      request: {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY",
          "X-API-Version": "v1"
        },
        body: {
          error_message: "TypeError: Cannot read property 'name' of undefined",
          stack_trace: "at processUser (app.js:15:23)\\nat main (app.js:8:5)",
          language: "javascript",
          framework: "node.js",
          context: {
            file_path: "src/app.js",
            line_number: 15,
            surrounding_code: "const userName = user.name;"
          }
        }
      },
      response: {
        success: true,
        analysis_id: "ana_1234567890abcdef",
        error_type: "TypeError",
        severity: "high",
        solutions: [
          {
            title: "Add null check before accessing property",
            description: "Verify the user object exists before accessing its properties",
            code_suggestion: "const userName = user?.name || 'Unknown';",
            confidence: 0.95
          }
        ],
        related_docs: [
          {
            title: "JavaScript Optional Chaining",
            url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining"
          }
        ],
        estimated_fix_time: "5 minutes"
      }
    },
    {
      id: "get-repositories",
      method: "GET", 
      path: "/api/v1/repositories",
      title: "Get Repositories",
      description: "Retrieve connected repositories for the authenticated user",
      request: {
        headers: {
          "Authorization": "Bearer YOUR_API_KEY",
          "X-API-Version": "v1"
        }
      },
      response: {
        success: true,
        repositories: [
          {
            id: "repo_1234567890",
            name: "my-awesome-project",
            provider: "github",
            full_name: "username/my-awesome-project",
            url: "https://github.com/username/my-awesome-project",
            language: "JavaScript",
            connected_at: "2025-01-15T10:30:00Z",
            analysis_count: 23,
            last_analysis: "2025-01-20T14:22:00Z"
          }
        ],
        total_count: 1,
        page: 1,
        per_page: 20
      }
    },
    {
      id: "connect-repository",
      method: "POST",
      path: "/api/v1/repositories/connect",
      title: "Connect Repository",
      description: "Connect a new repository for error analysis",
      request: {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY",
          "X-API-Version": "v1"
        },
        body: {
          provider: "github",
          repository_url: "https://github.com/username/project-name",
          access_token: "ghp_xxxxxxxxxxxxxxxxxxxx"
        }
      },
      response: {
        success: true,
        repository: {
          id: "repo_9876543210",
          name: "project-name",
          provider: "github",
          full_name: "username/project-name",
          connected_at: "2025-01-20T15:45:00Z",
          status: "connected"
        },
        message: "Repository connected successfully"
      }
    },
    {
      id: "get-analysis",
      method: "GET",
      path: "/api/v1/analysis/{analysis_id}",
      title: "Get Analysis",
      description: "Retrieve details of a specific error analysis",
      request: {
        headers: {
          "Authorization": "Bearer YOUR_API_KEY",
          "X-API-Version": "v1"
        }
      },
      response: {
        success: true,
        analysis: {
          id: "ana_1234567890abcdef",
          created_at: "2025-01-20T14:22:00Z",
          error_type: "TypeError",
          language: "javascript",
          severity: "high",
          status: "completed",
          solutions_count: 3,
          confidence_score: 0.92,
          processing_time: "1.2s"
        }
      }
    }
  ];

  const sdkExamples = [
    {
      language: "JavaScript",
      code: `const StackSeek = require('@stackseek/sdk');

const client = new StackSeek({
  apiKey: 'your-api-key'
});

async function analyzeError() {
  try {
    const analysis = await client.analyze({
      errorMessage: 'TypeError: Cannot read property...',
      language: 'javascript',
      context: {
        filePath: 'src/app.js',
        lineNumber: 15
      }
    });
    
    console.log(analysis.solutions);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}`
    },
    {
      language: "Python",
      code: `from stackseek import StackSeekClient

client = StackSeekClient(api_key="your-api-key")

try:
    analysis = client.analyze(
        error_message="NameError: name 'variable' is not defined",
        language="python",
        context={
            "file_path": "main.py",
            "line_number": 42
        }
    )
    
    for solution in analysis.solutions:
        print(f"Solution: {solution.title}")
        print(f"Code: {solution.code_suggestion}")
        
except Exception as e:
    print(f"Analysis failed: {e}")`
    },
    {
      language: "cURL",
      code: `curl -X POST https://api.stackseek.io/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Version: v1" \\
  -d '{
    "error_message": "NullPointerException at line 23",
    "language": "java",
    "framework": "spring-boot",
    "context": {
      "file_path": "src/main/java/App.java",
      "line_number": 23
    }
  }'`
    }
  ];

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
              <Terminal className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            StackSeek API
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
            Integrate AI-powered error analysis directly into your development workflow. 
            Build custom tools, automate debugging, and enhance your applications with intelligent error insights.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>REST API</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>SDKs Available</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {/* API Key Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Key className="h-5 w-5" />
              </div>
              <CardTitle>Authentication</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All API requests require authentication using an API key. Include your API key in the Authorization header:
            </p>
            <div className="relative bg-muted/50 rounded-lg p-4 font-mono text-sm">
              <code>Authorization: Bearer YOUR_API_KEY</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                className="absolute right-2 top-2"
              >
                {copiedCode === "auth-header" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Get your API key from your <a href="/dashboard" className="text-primary hover:underline">dashboard settings</a>.
            </p>
          </CardContent>
        </Card>

        {/* Base URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
              <code>https://api.stackseek.io</code>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">API Endpoints</h2>
          <div className="space-y-8">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="font-mono">
                        {endpoint.method}
                      </Badge>
                      <div>
                        <CardTitle className="font-mono text-lg">{endpoint.path}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Request */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Request
                      </h4>
                      <div className="relative">
                        <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{JSON.stringify(endpoint.request, null, 2)}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(endpoint.request, null, 2), `request-${endpoint.id}`)}
                          className="absolute right-2 top-2"
                        >
                          {copiedCode === `request-${endpoint.id}` ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Response */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Response
                      </h4>
                      <div className="relative">
                        <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                          <code>{JSON.stringify(endpoint.response, null, 2)}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2), `response-${endpoint.id}`)}
                          className="absolute right-2 top-2"
                        >
                          {copiedCode === `response-${endpoint.id}` ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SDK Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">SDK Examples</h2>
          <div className="space-y-6">
            {sdkExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {example.language}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted/50 rounded-lg p-4 text-sm overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(example.code, `sdk-${index}`)}
                      className="absolute right-2 top-2"
                    >
                      {copiedCode === `sdk-${index}` ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">1,000</div>
                <div className="text-sm text-muted-foreground">Requests per hour</div>
                <Badge variant="outline" className="mt-2">Free Tier</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">10,000</div>
                <div className="text-sm text-muted-foreground">Requests per hour</div>
                <Badge variant="outline" className="mt-2">Pro Tier</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">Unlimited</div>
                <div className="text-sm text-muted-foreground">Custom limits</div>
                <Badge variant="outline" className="mt-2">Enterprise</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Documentation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive guides and tutorials
                </p>
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/documentation"}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Docs
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help from our team
                </p>
                <Button variant="outline" size="sm" onClick={() => window.location.href = "/contact"}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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