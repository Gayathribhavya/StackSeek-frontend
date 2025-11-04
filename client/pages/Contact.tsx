import { ArrowLeft, Mail, MessageCircle, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For now, create a mailto link until EmailJS is configured
      // TODO: Replace with EmailJS configuration after setup
      const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
      const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

---
Submitted: ${new Date().toLocaleString()}
This message was sent from the StackSeek contact form.
      `);
      
      const mailtoLink = `mailto:contact@stackseek.io?subject=${subject}&body=${body}`;
      
      // Open mailto link
      window.location.href = mailtoLink;
      
      // Show success message and reset form
      setTimeout(() => {
        setIsLoading(false);
        alert("Thank you for your message! Your email client should open with the message ready to send to contact@stackseek.io");
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: ""
        });
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Contact form error:', error);
      alert("There was an error processing your request. Please email us directly at contact@stackseek.io");
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "contact@stackseek.io",
      description: "General inquiries and support"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Available 24/7",
      description: "Instant support for urgent issues"
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "< 24 hours",
      description: "We aim to respond quickly"
    },
    {
      icon: MapPin,
      title: "Headquarters",
      details: "Coimbatore, India",
      description: "Remote-first company"
    }
  ];

  const faqs = [
    {
      question: "How does StackSeek integrate with my existing workflow?",
      answer: "StackSeek integrates seamlessly with GitHub, GitLab, Bitbucket, and Azure DevOps. Simply connect your repositories and start receiving AI-powered error analysis immediately."
    },
    {
      question: "Is my code data secure and private?",
      answer: "Absolutely. We use enterprise-grade encryption, process only error logs (not complete codebases), and maintain strict security protocols. Your intellectual property remains private."
    },
    {
      question: "What programming languages do you support?",
      answer: "We are supporting all programming languages. Our AI models are continuously trained on diverse codebases."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes! We offer custom integrations, on-premise deployment options, and dedicated support for enterprise clients. Contact our sales team to discuss your specific needs."
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
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Have questions about StackSeek? Want to discuss enterprise solutions? 
            Or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                    <p className="text-primary font-medium mb-1">{info.details}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleChange("name")}
                          required
                          placeholder="Your full name"
                          className="transition-colors focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange("email")}
                          required
                          placeholder="your@email.com"
                          className="transition-colors focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={handleChange("company")}
                        placeholder="Your company name"
                        className="transition-colors focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange("subject")}
                        required
                        placeholder="What's this about?"
                        className="transition-colors focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message *
                      </Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange("message")}
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      {isLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales & Support Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Sales Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Interested in enterprise solutions, custom integrations, or bulk pricing? 
                  Our sales team is here to help.
                </p>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">contact@stackseek.io</p>
                  <p className="text-sm text-muted-foreground">Enterprise Sales Team</p>
                </div>
                <Button 
                  className="transition-all duration-200 hover:scale-105"
                  onClick={() => window.location.href = "mailto:contact@stackseek.io?subject=Enterprise Inquiry"}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Technical Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Need help with integration, troubleshooting, or have technical questions? 
                  Our support team is ready to assist.
                </p>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">contact@stackseek.io</p>
                  <p className="text-sm text-muted-foreground">Technical Support Team</p>
                </div>
                <Button 
                  variant="secondary"
                  className="transition-all duration-200 hover:scale-105"
                  onClick={() => window.location.href = "mailto:contact@stackseek.io?subject=Technical Support"}
                >
                  Get Support
                </Button>
              </CardContent>
            </Card>
          </div>
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