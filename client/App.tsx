import { useState } from "react";
import { Link } from "wouter";
import Login from "@/pages/LoginNew";
import Register from "@/pages/RegisterNew";
import Dashboard from "@/pages/DashboardNew";
import ConnectRepository from "@/pages/ConnectRepositoryNew";
import ConnectedRepositories from "@/pages/ConnectedRepositories";
import ForgotPassword from "@/pages/ForgotPasswordNew";
import Settings from "@/pages/Settings";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Security from "@/pages/Security";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import CookiePolicy from "@/pages/CookiePolicy";
import Documentation from "@/pages/Documentation";
import API from "@/pages/API";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Zap,
  Shield,
  Code2,
  GitBranch,
  LineChart,
  CheckCircle,
  Check,
  ArrowRight,
  Globe,
  Users,
  Gauge,
  Phone,
  MessageCircle,
  Mail,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";

function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  const handleSignIn = () => {
    onNavigate("login");
  };

  const handleGetStarted = () => {
    onNavigate("register");
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI models analyze your errors and provide intelligent solutions in seconds",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Multi-Language Support",
      description:
        "Support for all programming languages - comprehensive error analysis across any language or framework",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Git Integration",
      description:
        "Connect your repositories from GitHub, GitLab, Bitbucket, and other providers",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description:
        "Your code and data are encrypted and never stored permanently",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Error Analytics",
      description:
        "Track error patterns and get insights to prevent future issues",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Share solutions and collaborate with your team members",
    },
  ];

  const stats = [
    { value: "50K+", label: "Errors Analyzed" },
    { value: "10K+", label: "Active Developers" },
    { value: "99.9%", label: "Uptime" },
    { value: "< 3s", label: "Analysis Time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-teal-50/30 dark:from-gray-950 dark:via-slate-900/50 dark:to-indigo-950/40 transition-colors duration-500">
      {/* Navigation */}
      <nav className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm dark:shadow-lg dark:shadow-slate-900/50 transition-all duration-500">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-1 animate-scale-in">
              <img
                src="/stack-seek-high-resolution-logo-transparent (6).png"
                alt="Stack Seek Logo"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110"
              />
              
            </div>

            {/* Spacer to push everything to the right */}
            <div className="flex-1"></div>

            {/* Desktop Navigation - all items grouped to the right */}
            <div className="hidden md:flex items-center space-x-4 animate-scale-in">
              <a
                href="#features"
                onClick={(e) => handleScrollToSection(e, "features")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base lg:text-lg"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleScrollToSection(e, "how-it-works")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base lg:text-lg"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleScrollToSection(e, "pricing")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base lg:text-lg"
              >
                Pricing
              </a>
              <Button
                variant="ghost"
                onClick={handleSignIn}
                className="font-medium transition-all duration-300 hover:scale-105 text-base px-3 lg:px-4"
              >
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg font-medium px-3 lg:px-6 transition-all duration-300 hover:scale-105 enhanced-button text-base"
              >
                Get Started Free
              </Button>
              <ThemeToggle />
            </div>

            {/* Mobile right side items */}
            <div className="md:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
              <div className="space-y-2">
                <a
                  href="#features"
                  onClick={(e) => handleScrollToSection(e, "features")}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleScrollToSection(e, "how-it-works")}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  onClick={(e) => handleScrollToSection(e, "pricing")}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-base"
                >
                  Pricing
                </a>
                <div className="pt-2 space-y-2">
                  <Button
                    variant="ghost"
                    onClick={handleSignIn}
                    className="w-full font-medium"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg font-medium enhanced-button"
                  >
                    Get Started Free
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-24 sm:pb-36 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-slate-800/70 dark:via-indigo-900/60 dark:to-blue-900/70 text-blue-800 dark:text-blue-300 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-8 shadow-sm dark:shadow-lg dark:shadow-indigo-900/30 text-xs sm:text-sm border border-transparent dark:border-slate-700/50 animate-scale-in"
            style={{ animationDelay: "100ms" }}
          >
            <Gauge className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-semibold tracking-wide">
              Trusted by 10,000+ developers worldwide
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight px-2 animate-scale-in"
            style={{ animationDelay: "200ms" }}
          >
            Error Analysis
            <br />
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-slate-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 dark:drop-shadow-sm animate-scale-in"
            style={{ animationDelay: "300ms" }}
          >
            StackSeek uses cutting-edge AI to analyze your errors, provide
            instant solutions, and help you write better code. Stop wasting
            hours on debugging.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16 px-4 animate-scale-in"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl font-medium transition-all duration-300 hover:scale-105 enhanced-button"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <HelpCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  How it Works
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    How StackSeek Works
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Follow these steps to maximize your development productivity with StackSeek's AI-powered error analysis
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Steps 1, 2, 3 */}
                  <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        Account Registration
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Create your StackSeek account or authenticate with existing credentials to access our comprehensive error analysis platform.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        Repository Integration
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Connect your GitHub, GitLab, Bitbucket, or Azure DevOps repositories to enable context-aware error analysis and intelligent code suggestions.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        Navigate to Analysis Dashboard
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Following successful repository connection, select "Skip Now" to bypass additional setup and proceed directly to the error analysis dashboard.
                      </p>
                    </div>
                  </div>


                  {/* Step 5 */}
                  </div>
                  
                  {/* Right Column: Steps 4, 5 */}
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        4
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          AI-Powered Error Analysis
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Submit your stack traces and error messages to receive comprehensive, AI-generated solutions with detailed explanations and code fixes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        5
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                          Advanced Resources
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Explore our comprehensive documentation, tutorials, and best practices to leverage StackSeek's full potential for your development workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      Get Started Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHowItWorksOpen(false);
                        setTimeout(() => {
                          const element = document.getElementById('features');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 300);
                      }}
                      className="px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                    >
                      View Features
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto px-4 animate-scale-in"
            style={{ animationDelay: "500ms" }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-scale-in transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100 + 600}ms` }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 sm:py-20 px-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
              Everything You Need to Debug Efficiently
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
              StackSeek provides comprehensive error analysis tools powered by
              advanced AI
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-black/30 transition-all duration-300 border-gray-100 dark:border-slate-700 hover:scale-[1.02] bg-white/80 dark:bg-slate-800 dark:hover:bg-slate-750 backdrop-blur-sm animate-scale-in hover:border-gray-200 dark:hover:border-slate-600"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 text-blue-600 dark:text-blue-300 shadow-sm dark:shadow-lg dark:shadow-black/20 border border-transparent dark:border-slate-500/30 transition-all duration-300 hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950/90 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
              How StackSeek Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 leading-relaxed px-4">
              Get from error to solution in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div
              className="text-center animate-scale-in"
              style={{ animationDelay: "100ms" }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl transition-all duration-300 hover:scale-110">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                Paste Your Error
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                Copy and paste your error message or stack trace into StackSeek
              </p>
            </div>

            <div
              className="text-center animate-scale-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl transition-all duration-300 hover:scale-110">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                AI Analysis
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                Our AI analyzes your error and generates comprehensive solutions
              </p>
            </div>

            <div
              className="text-center animate-scale-in"
              style={{ animationDelay: "300ms" }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl transition-all duration-300 hover:scale-110">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                Apply Solutions
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed px-4">
                Get step-by-step fixes and code suggestions to resolve your
                issue
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950/80 dark:to-slate-900 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 leading-relaxed px-4">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto items-stretch">
            {/* Free Trial / Starter Plan */}
            <Card
              className="relative flex flex-col hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-slate-900/60 transition-all duration-300 border-gray-100 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/70 dark:hover:bg-slate-800/90 backdrop-blur-sm animate-scale-in hover:border-gray-200 dark:hover:border-slate-600/80 hover:scale-[1.02]"
              style={{ animationDelay: "100ms" }}
            >
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                    Free Trial -Starter
                  </h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      Free
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        25 analyses/month
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Up to 10 repos
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Community support only
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Basic error analysis
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Public repositories only
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-4 font-medium text-center">
                  ⚡ Try StackSeek with a small project before upgrading.
                </p>
                <Button
                  variant="outline"
                  onClick={handleGetStarted}
                  className="w-full mt-auto transition-all duration-300 hover:scale-105 enhanced-button"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card
              className="relative flex flex-col border-blue-200 dark:border-indigo-700/70 shadow-2xl dark:shadow-2xl dark:shadow-slate-900/60 hover:shadow-3xl dark:hover:shadow-indigo-900/40 transition-all duration-300 bg-white dark:bg-slate-800/80 animate-scale-in hover:border-blue-300 dark:hover:border-indigo-600/80 hover:scale-[1.02]"
              style={{ animationDelay: "200ms" }}
            >
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                Most Popular
              </div>
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                    Pro
                  </h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      $99
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        500 analyses/month
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Up to 25 repos
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Email support
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Exportable error reports (TXT/JSON)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Private repositories
                      </span>
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-500 mt-auto transition-all duration-300 hover:scale-105 enhanced-button"
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card
              className="relative flex flex-col hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-slate-900/60 transition-all duration-300 border-gray-100 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/70 dark:hover:bg-slate-800/90 backdrop-blur-sm animate-scale-in hover:border-gray-200 dark:hover:border-slate-600/80 hover:scale-[1.02]"
              style={{ animationDelay: "300ms" }}
            >
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                    Team
                  </h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      $399
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        5,000 analyses/month
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Up to 150 repos
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Priority email
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Exportable error reports (TXT/JSON)
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Advanced replication steps
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Integrations
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@stackseek.io?subject=Team%20Plan%20Inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-10 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white dark:hover:border-slate-500 transition-all duration-300 hover:scale-105 enhanced-button"
                    >
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Contact Sales</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card
              className="relative flex flex-col hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-slate-900/60 transition-all duration-300 border-gray-100 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/70 dark:hover:bg-slate-800/90 backdrop-blur-sm animate-scale-in hover:border-gray-200 dark:hover:border-slate-600/80 hover:scale-[1.02]"
              style={{ animationDelay: "400ms" }}
            >
              <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                    Enterprise
                  </h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                      Custom
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">
                      Plan
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Unlimited analyses
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Unlimited repos
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        On-prem / private cloud option
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Dedicated success manager
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        SSO, audit logs, compliance (SOC2/GDPR ready)
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:contact@stackseek.io?subject=Enterprise%20Plan%20Inquiry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-10 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white dark:hover:border-slate-500 transition-all duration-300 hover:scale-105 enhanced-button"
                    >
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Contact Sales</span>
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-blue-700 to-blue-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate-scale-in transition-all duration-300 hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                  {stat.value}
                </div>
                <div className="text-white/80 text-base sm:text-lg lg:text-lg font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-32 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-indigo-950/60 transition-colors duration-500">
        <div className="max-w-4xl mx-auto text-center animate-scale-in">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2 animate-scale-in"
            style={{ animationDelay: "100ms" }}
          >
            Ready to Debug Smarter?
          </h2>
          <p
            className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 mb-8 sm:mb-10 leading-relaxed px-4 animate-scale-in"
            style={{ animationDelay: "200ms" }}
          >
            Join thousands of developers who are already saving hours on
            debugging
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl px-8 sm:px-12 py-5 sm:py-7 text-lg sm:text-xl font-medium animate-scale-in transition-all duration-300 hover:scale-105 enhanced-button"
            style={{ animationDelay: "300ms" }}
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 font-medium px-4">
            No credit card required • Free forever for personal use
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 dark:from-slate-950 to-black text-white py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-start">
  <img
    src="/stack-seek-high-resolution-logo-transparent (6).png"  // This should be your combined logo + text image
    alt="StackSeek Logo"
    className="h-9 w-auto sm:h-12 sm:w-auto object-contain"
  />
  <p className="text-gray-400 leading-relaxed text-base sm:text-lg mt-1">
    AI-powered error analysis for modern developers. Debug smarter,
    ship faster.
  </p>
</div>


            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">
                Product
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-base sm:text-lg">
                <li>
                  <a
                    href="#features"
                    onClick={(e) => handleScrollToSection(e, "features")}
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    onClick={(e) => handleScrollToSection(e, "pricing")}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a 
                    href="/documentation" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("documentation");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">
                Company
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-base sm:text-lg">
                <li>
                  <a 
                    href="/about" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("about");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="/blog" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("blog");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="/careers" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("careers");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("contact");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">
                Legal
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-base sm:text-lg">
                <li>
                  <a 
                    href="/privacy-policy" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("privacy-policy");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="/terms-of-service" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("terms-of-service");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="/security" 
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate("security");
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-base sm:text-lg">
            <p>&copy; 2025 StackSeek. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Simple URL-based routing
    const path = window.location.pathname;
    console.log("Current path:", path);
    if (path === "/login") return "login";
    if (path === "/register") return "register";
    if (path === "/dashboard") return "dashboard";
    if (path === "/connect-repository") return "connect-repository";
    if (path === "/connected-repositories") return "connected-repositories";
    if (path === "/forgot-password") return "forgot-password";
    if (path === "/settings") return "settings";
    if (path === "/privacy-policy") return "privacy-policy";
    if (path === "/terms-of-service") return "terms-of-service";
    if (path === "/security") return "security";
    if (path === "/about") return "about";
    if (path === "/blog") return "blog";
    if (path === "/careers") return "careers";
    if (path === "/contact") return "contact";
    if (path === "/cookie-policy") return "cookie-policy";
    if (path === "/documentation") return "documentation";
    if (path === "/api") return "api";
    return "home";
  });

  console.log("Current page state:", currentPage);

  const handleNavigate = (page: string) => {
    console.log("Navigating to page:", page);
    setCurrentPage(page);
    window.history.pushState({}, "", page === "home" ? "/" : `/${page}`);
    console.log("Navigation complete, current page:", page);
  };

  // Handle browser back/forward
  window.onpopstate = () => {
    const path = window.location.pathname;
    if (path === "/login") setCurrentPage("login");
    else if (path === "/register") setCurrentPage("register");
    else if (path === "/dashboard") setCurrentPage("dashboard");
    else if (path === "/connect-repository")
      setCurrentPage("connect-repository");
    else if (path === "/connected-repositories")
      setCurrentPage("connected-repositories");
    else if (path === "/forgot-password") setCurrentPage("forgot-password");
    else if (path === "/settings") setCurrentPage("settings");
    else if (path === "/privacy-policy") setCurrentPage("privacy-policy");
    else if (path === "/terms-of-service") setCurrentPage("terms-of-service");
    else if (path === "/security") setCurrentPage("security");
    else if (path === "/about") setCurrentPage("about");
    else if (path === "/blog") setCurrentPage("blog");
    else if (path === "/careers") setCurrentPage("careers");
    else if (path === "/contact") setCurrentPage("contact");
    else if (path === "/cookie-policy") setCurrentPage("cookie-policy");
    else if (path === "/documentation") setCurrentPage("documentation");
    else if (path === "/api") setCurrentPage("api");
    else setCurrentPage("home");
  };

  if (currentPage === "login") {
    return <Login />;
  }

  if (currentPage === "register") {
    return <Register />;
  }

  if (currentPage === "dashboard") {
    return <Dashboard />;
  }

  if (currentPage === "connect-repository") {
    return <ConnectRepository />;
  }

  if (currentPage === "connected-repositories") {
    return <ConnectedRepositories />;
  }

  if (currentPage === "forgot-password") {
    return <ForgotPassword />;
  }

  if (currentPage === "settings") {
    return <Settings />;
  }

  if (currentPage === "privacy-policy") {
    return <PrivacyPolicy />;
  }

  if (currentPage === "terms-of-service") {
    return <TermsOfService />;
  }

  if (currentPage === "security") {
    return <Security />;
  }


  if (currentPage === "about") {
    return <About />;
  }

  if (currentPage === "blog") {
    return <Blog />;
  }

  if (currentPage === "careers") {
    return <Careers />;
  }

  if (currentPage === "contact") {
    return <Contact />;
  }

  if (currentPage === "cookie-policy") {
    return <CookiePolicy />;
  }

  if (currentPage === "documentation") {
    return <Documentation />;
  }

  if (currentPage === "api") {
    return <API />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
}

export default App;
