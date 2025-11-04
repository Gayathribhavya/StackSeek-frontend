import { ArrowLeft, Code, Zap, Shield, Users, Award, TrendingUp, Target, Lightbulb, Globe } from "lucide-react";
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

export default function About() {
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Errors Analyzed", value: "10M+", icon: Code },
    { label: "Developers Served", value: "50K+", icon: Users },
    { label: "Accuracy Rate", value: "98.5%", icon: Award },
    { label: "Response Time", value: "<1s", icon: Zap }
  ];

  const features = [
    {
      title: "AI-Powered Error Analysis",
      description: "Our advanced machine learning models analyze error patterns and provide intelligent insights to help you debug faster.",
      icon: Code
    },
    {
      title: "Real-Time Processing",
      description: "Get instant analysis and suggestions as soon as errors occur in your codebase.",
      icon: Zap
    },
    {
      title: "Enterprise Security",
      description: "Your code stays private with enterprise-grade encryption and security protocols.",
      icon: Shield
    },
    {
      title: "Team Collaboration",
      description: "Share insights, track progress, and collaborate effectively with your development team.",
      icon: Users
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI and machine learning to deliver cutting-edge solutions."
    },
    {
      title: "Simplicity",
      description: "We believe powerful tools should be easy to use. Our interfaces are designed for clarity and efficiency."
    },
    {
      title: "Privacy",
      description: "Your code is your intellectual property. We process only what's necessary and maintain the highest security standards."
    },
    {
      title: "Quality",
      description: "We're committed to delivering reliable, accurate, and actionable insights that truly help improve your code."
    },
    {
      title: "Community",
      description: "We believe in supporting the developer community through open collaboration and shared knowledge."
    },
    {
      title: "Growth",
      description: "We're dedicated to continuous learning and improvement, both for our team and our users."
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToHome} variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 hover:bg-accent/50">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/stack-seek-high-resolution-logo-transparent (6).png"
              alt="StackSeek Logo"
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About StackSeek
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            We're revolutionizing how developers approach error analysis and code quality improvement. 
            Our AI-powered platform makes debugging faster, smarter, and more insightful.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = "/register"}
              className="transition-all duration-200 hover:scale-105"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = "/contact"}
              className="transition-all duration-200 hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold text-center text-foreground mb-6">Our Story</h2>
              <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  StackSeek is revolutionizing the way developers approach error analysis and code quality. 
                  Founded on the principle that every developer deserves intelligent, AI-powered insights 
                  to improve their code, we're building tools that make debugging faster, more efficient, 
                  and more insightful than ever before.
                </p>
                
                <p>
                  In 2023, we set out to change the debugging experience by leveraging the power of artificial intelligence 
                  to provide contextual, actionable insights that go beyond traditional error reporting. 
                  We wanted to create a tool that didn't just identify problems but helped developers 
                  understand them and learn from them.
                </p>
                
                <p>
                  Today, StackSeek serves thousands of developers worldwide, from solo entrepreneurs 
                  to Fortune 500 companies. Our AI models continue to learn and improve, making 
                  every error analysis more accurate and insightful than the last.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To empower developers worldwide with AI-driven error analysis that transforms 
                  debugging from a time-consuming challenge into an opportunity for learning and improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A world where every developer has access to intelligent, contextual insights 
                  that help them write better code, solve problems faster, and continuously improve their skills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Developers Worldwide</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-primary/20 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose StackSeek?</h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to enhance your development workflow
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">{value.title}</h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Technology</h2>
          <div className="space-y-6">
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-3 text-foreground">AI-Powered Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our proprietary machine learning models are trained on millions of error patterns 
                and solutions, enabling us to provide contextual, accurate insights for a wide 
                range of programming languages and frameworks.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-3 text-foreground">Seamless Integration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with developer workflows in mind, StackSeek integrates seamlessly with 
                popular version control systems, CI/CD pipelines, and development environments.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-3 text-foreground">Real-time Processing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get instant feedback and analysis as you code, with real-time error detection 
                and intelligent suggestions powered by our cloud-native infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Seamless Integrations</h2>
            <p className="text-xl text-muted-foreground mb-8">
              StackSeek works with the tools you already use
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border">
              <Badge variant="secondary" className="text-lg py-2 px-4">GitHub</Badge>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border">
              <Badge variant="secondary" className="text-lg py-2 px-4">GitLab</Badge>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border">
              <Badge variant="secondary" className="text-lg py-2 px-4">Bitbucket</Badge>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg border">
              <Badge variant="secondary" className="text-lg py-2 px-4">Azure DevOps</Badge>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Connect your repositories in seconds and start getting AI-powered insights immediately
            </p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Journey</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We're always looking for talented individuals who share our passion for improving 
                the developer experience. Whether you're interested in AI, frontend development, 
                backend architecture, or developer relations, we'd love to hear from you.
              </p>
              <p className="text-muted-foreground mb-8">
                <strong className="text-foreground">Email us:</strong> contact@stackseek.io
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "/careers"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  View Open Positions
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = "mailto:contact@stackseek.io"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Get in Touch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="bg-gradient-to-r from-primary/10 to-background border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Debugging Experience?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of developers who are already building better software with StackSeek
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "/register"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = "/contact"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/final-transparent-logo.png"
              alt="Stack Seek Logo"
              className="h-12 w-auto"
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