import { ArrowLeft, MapPin, Clock, Users, Briefcase, Heart, Zap, Trophy, Globe } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Careers() {
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jobOpenings = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Coimbatore, India / Remote",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our frontend team to build beautiful, intuitive interfaces for our AI-powered error analysis platform.",
      requirements: ["React, TypeScript, Next.js", "5+ years frontend experience", "UI/UX design sensibility", "Experience with modern tooling"]
    },
    {
      title: "ML Engineer - Error Analysis",
      department: "Engineering",
      location: "Coimbatore, India / Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Help improve our machine learning models that power intelligent error analysis and debugging assistance.",
      requirements: ["Python, TensorFlow/PyTorch", "ML/AI experience", "Natural language processing", "Large-scale data processing"]
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Build scalable backend systems that process millions of error logs and deliver real-time insights to developers.",
      requirements: ["Node.js, Go, or Python", "Distributed systems", "Database optimization", "Cloud platforms (AWS/GCP)"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Maintain and scale our infrastructure to support growing developer teams with reliable, fast error analysis.",
      requirements: ["Kubernetes, Docker", "CI/CD pipelines", "Infrastructure as Code", "Monitoring and observability"]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Coimbatore, India / Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Shape the user experience of our platform, making complex error analysis accessible and intuitive for developers.",
      requirements: ["Figma, design systems", "User research skills", "Developer tools experience", "Prototyping expertise"]
    },
    {
      title: "Technical Writer",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Create comprehensive documentation, guides, and educational content to help developers get the most out of StackSeek.",
      requirements: ["Technical writing experience", "Developer background", "API documentation", "Content strategy"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance plus wellness stipend"
    },
    {
      icon: Globe,
      title: "Remote-First Culture",
      description: "Work from anywhere with flexible hours and quarterly team retreats"
    },
    {
      icon: Zap,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget and conference attendance support"
    },
    {
      icon: Trophy,
      title: "Equity & Compensation",
      description: "Competitive salary plus equity in a fast-growing company"
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Unlimited PTO policy and mental health days"
    },
    {
      icon: Briefcase,
      title: "Equipment & Setup",
      description: "Top-tier MacBook and $1,500 home office setup allowance"
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We push boundaries and explore new possibilities in AI and developer tooling"
    },
    {
      title: "Developer Empathy",
      description: "We understand developer pain points because we've been there ourselves"
    },
    {
      title: "Quality Over Quantity",
      description: "We believe in shipping features that truly matter and work exceptionally well"
    },
    {
      title: "Continuous Learning",
      description: "We're always learning, growing, and sharing knowledge with each other"
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
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Help us revolutionize how developers approach debugging and error analysis. 
            Join a team of passionate engineers, designers, and product leaders building the future of developer tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              className="transition-all duration-200 hover:scale-105"
            >
              View Open Positions
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = "mailto:contact@stackseek.io?subject=General Inquiry&body=Hello StackSeek Team,%0A%0AI would like to get in touch regarding:%0A%0A[Please describe your inquiry]%0A%0ABest regards"}
              className="transition-all duration-200 hover:scale-105"
            >
              Get in Touch
            </Button>
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
          
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Work at StackSeek?</h2>
            <p className="text-xl text-muted-foreground">
              We believe in taking care of our team so they can do their best work
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-xl text-muted-foreground">
              Ready to make an impact? Join our growing team
            </p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-3">
                        <Badge variant="secondary">{job.department}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          {job.experience}
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="shrink-0"
                      onClick={() => window.location.href = `mailto:contact@stackseek.io?subject=Job Application: ${job.title}&body=Dear StackSeek Team,%0A%0AI am interested in applying for the ${job.title} position.%0A%0APlease find my details below:%0A%0AName: %0AEmail: %0APhone: %0ALinkedIn/Portfolio: %0A%0AAttached: Resume%0A%0ABest regards`}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {job.description}
                  </p>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Requirements:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, reqIndex) => (
                        <Badge key={reqIndex} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Culture</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  At StackSeek, we're building more than just a product—we're building a community of 
                  passionate individuals who believe in the power of great developer tools. Our team 
                  combines deep technical expertise with genuine empathy for the developer experience.
                </p>
                
                <p>
                  We're a remote-first company that values flexibility, autonomy, and work-life balance. 
                  Whether you're an early bird or a night owl, in Coimbatore or Singapore, we believe 
                  great work can happen anywhere, anytime.
                </p>
                
                <p>
                  Our culture is built on collaboration, continuous learning, and supporting each other's 
                  growth. We celebrate successes together, learn from failures, and always push each 
                  other to be better while maintaining a healthy, sustainable pace.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Don't See the Right Role?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                We're always looking for talented people who share our vision. 
                Reach out and tell us how you'd like to contribute to StackSeek.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = "mailto:contact@stackseek.io?subject=Career Inquiry&body=Dear StackSeek Team,%0A%0AI don't see the right role listed but I'm interested in joining your team.%0A%0AAbout me:%0A- Background: %0A- Skills: %0A- Interest: %0A%0APlease let me know if there might be opportunities that fit my profile.%0A%0ABest regards"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Contact Us
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = "/company"}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Learn More About Us
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