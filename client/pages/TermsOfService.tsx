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

export default function TermsOfService() {
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
            <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using StackSeek ("Service"), you accept and agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use our Service. These Terms apply to all users of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  StackSeek provides AI-powered error analysis and code quality improvement services for software developers. 
                  Our Service includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Automated error detection and analysis</li>
                  <li>AI-generated insights and recommendations</li>
                  <li>Integration with GitHub, GitLab, Bitbucket, and Azure DevOps</li>
                  <li>Real-time error tracking and monitoring</li>
                  <li>Code quality metrics and reporting</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts and Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">3.1 Account Creation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You must provide accurate, current, and complete information during registration. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.2 Account Security</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for all activities under your account. Notify us immediately of any unauthorized use 
                    or security breaches.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">3.3 Eligibility</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You must be at least 18 years old and have the authority to enter into these Terms.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Repository Access and Data Usage</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">4.1 Access Permissions</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By connecting repositories, you grant StackSeek read-only access to analyze error logs, 
                    stack traces, and code structure for error analysis purposes only.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">4.2 Data Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We process only the data necessary for error analysis. We do not store complete codebases 
                    or redistribute your intellectual property.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">4.3 Access Revocation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may revoke repository access at any time through your account settings or repository provider.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Acceptable Use Policy</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Use the Service for illegal activities or to violate any laws</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' data</li>
                  <li>Interfere with or disrupt the Service or its infrastructure</li>
                  <li>Use automated scripts to access the Service without permission</li>
                  <li>Reverse engineer, decompile, or attempt to extract source code</li>
                  <li>Share your account credentials with others</li>
                  <li>Upload malicious code, viruses, or harmful content</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Subscription and Payment Terms</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">6.1 Subscription Plans</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    StackSeek offers various subscription tiers with different features and usage limits. 
                    Current pricing is available on our website.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">6.2 Billing and Payments</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Subscriptions are billed in advance on a monthly or annual basis. Payment is due immediately upon subscription. 
                    All fees are non-refundable except as required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">6.3 Cancellation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">7.1 Your Content</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain all rights to your code and data. You grant us a limited license to process 
                    your data solely to provide the Service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">7.2 Our Service</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    StackSeek and all related intellectual property are owned by us and protected by copyright, 
                    trademark, and other laws.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Service Availability and Modifications</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">8.1 Availability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive for high availability but do not guarantee uninterrupted service. 
                    We may suspend service for maintenance, updates, or security reasons.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">8.2 Service Changes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may modify, update, or discontinue features with reasonable notice. 
                    Significant changes will be communicated in advance.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Our collection and use of your information is governed by our 
                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>, 
                which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Disclaimers and Limitation of Liability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">10.1 Service Disclaimers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Service is provided "as is" without warranties of any kind. We do not guarantee 
                    the accuracy, completeness, or reliability of our error analysis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">10.2 Limitation of Liability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, our liability is limited to the amount paid 
                    for the Service in the 12 months preceding the claim.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Termination</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Violation of these Terms</li>
                  <li>Non-payment of fees</li>
                  <li>Illegal or harmful activities</li>
                  <li>Prolonged inactivity</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Upon termination, your access to the Service will cease, and we may delete your data 
                  in accordance with our retention policies.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Governing Law and Dispute Resolution</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">12.1 Governing Law</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms are governed by the laws of California, United States, without regard to conflict of law principles.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">12.2 Dispute Resolution</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Any disputes will be resolved through binding arbitration in accordance with the rules 
                    of the American Arbitration Association.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. Material changes will be communicated via email 
                or through the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact us at:
                <br />
                <strong>Email:</strong> contact@stackseek.io
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