import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PrivacyPolicy() {
  const handleBackToHome = () => {
    window.location.href = "/";
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1.1 Account Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When you create a StackSeek account, we collect your name, email address, and authentication credentials. 
                    We may also collect profile information and preferences you choose to provide.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">1.2 Repository Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect repository URLs, access tokens, and metadata necessary to perform error analysis. 
                    We do not store your entire codebase, only the error logs and stack traces you choose to analyze.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">1.3 Usage Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information about how you use our service, including analysis requests, 
                    feature usage, and performance metrics to improve our AI-powered error analysis.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide and maintain our error analysis services</li>
                  <li>Process and analyze error logs and stack traces</li>
                  <li>Generate AI-powered insights and recommendations</li>
                  <li>Communicate with you about service updates and support</li>
                  <li>Improve our machine learning models and algorithms</li>
                  <li>Ensure security and prevent unauthorized access</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing and Disclosure</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 No Sale of Personal Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Service Providers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share information with trusted service providers who assist in operating our platform, 
                    including cloud hosting providers (AWS), authentication services, and analytics tools.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Legal Requirements</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may disclose information when required by law, court order, or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We implement enterprise-grade security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>End-to-end encryption for data transmission</li>
                  <li>Encrypted storage of sensitive information</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Secure token management for repository access</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights and Choices</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access and review your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your analysis reports and data</li>
                  <li>Opt-out of non-essential communications</li>
                  <li>Withdraw repository access permissions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only as long as necessary to provide our services. 
                Error analysis data is retained for up to 12 months unless you request deletion. 
                Account information is retained until you delete your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are hosted on AWS infrastructure. Data may be processed in regions outside your country, 
                but we ensure appropriate safeguards are in place to protect your information in accordance with 
                applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <strong>Email:</strong> contact@stackseek.io
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the "Last updated" date. 
                Your continued use of our services constitutes acceptance of the updated policy.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

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