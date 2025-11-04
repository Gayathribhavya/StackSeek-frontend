import { ArrowLeft } from "lucide-react";
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

export default function Security() {
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Security at StackSeek</CardTitle>
            <p className="text-center text-muted-foreground">
              Your security and privacy are our top priorities. Learn how we protect your code and data.
            </p>
          </CardHeader>
          <CardContent className="max-w-none space-y-8">
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Enterprise-Grade Encryption</h2>
              </div>
              <div className="space-y-6 pl-0">
                <div className="border-l-2 border-green-200 dark:border-green-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Data in Transit</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    All data transmission between your browser and our servers is protected using TLS 1.3 encryption, 
                    the latest and most secure transport layer security protocol. This ensures that your code and 
                    personal information cannot be intercepted during transmission.
                  </p>
                </div>
                <div className="border-l-2 border-green-200 dark:border-green-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Data at Rest</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Your data is encrypted using AES-256 encryption when stored in our databases. 
                    Access tokens and sensitive information are encrypted with additional layers of security, 
                    ensuring maximum protection even in our secure cloud environment.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Secure Authentication</h2>
              </div>
              <div className="space-y-6 pl-0">
                <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Multi-Factor Authentication (MFA)</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We support multi-factor authentication to add an extra layer of security to your account. 
                    Enable MFA to require both your password and a verification code from your mobile device.
                  </p>
                </div>
                <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">OAuth Integration</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Secure OAuth 2.0 integration with GitHub, GitLab, Bitbucket, and Azure DevOps. 
                    We never store your repository passwords - only secure, scoped access tokens that you can revoke at any time.
                  </p>
                </div>
                <div className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Session Management</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Secure session tokens with automatic expiration, secure cookie attributes, 
                    and protection against session hijacking and CSRF attacks.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Infrastructure Security</h2>
              </div>
              <div className="space-y-6 pl-0">
                <div className="border-l-2 border-purple-200 dark:border-purple-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">AWS Cloud Infrastructure</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are hosted on Amazon Web Services (AWS), which provides enterprise-grade security, 
                    compliance certifications (SOC 2, ISO 27001, PCI DSS), and 99.99% uptime SLA. 
                    All data is stored in secure, geographically distributed data centers.
                  </p>
                </div>
                <div className="border-l-2 border-purple-200 dark:border-purple-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Network Security</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Our infrastructure includes firewalls, DDoS protection, intrusion detection systems, 
                    and network segmentation to prevent unauthorized access and protect against attacks.
                  </p>
                </div>
                <div className="border-l-2 border-purple-200 dark:border-purple-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Regular Security Updates</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We maintain up-to-date systems with the latest security patches and regularly update 
                    our dependencies to address any known vulnerabilities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Data Protection & Privacy</h2>
              </div>
              <div className="space-y-6 pl-0">
                <div className="border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Minimal Data Collection</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We only collect and process the minimum data necessary to provide our error analysis service. 
                    We analyze error logs and stack traces, not your entire codebase.
                  </p>
                </div>
                <div className="border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">Data Retention Policies</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Error analysis data is automatically deleted after 12 months. You can request immediate 
                    deletion of your data at any time through your account settings.
                  </p>
                </div>
                <div className="border-l-2 border-orange-200 dark:border-orange-800 pl-4">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-foreground">GDPR & CCPA Compliance</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    We comply with international privacy regulations including GDPR and CCPA. 
                    You have full control over your data and can exercise your privacy rights at any time.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Security Monitoring & Incident Response</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We maintain comprehensive security monitoring and incident response procedures:
                </p>
                <ul className="space-y-2 pl-4">
                  <li className="text-muted-foreground">• 24/7 security monitoring and alerting systems</li>
                  <li className="text-muted-foreground">• Automated threat detection and response</li>
                  <li className="text-muted-foreground">• Regular security audits and penetration testing</li>
                  <li className="text-muted-foreground">• Incident response team with defined escalation procedures</li>
                  <li className="text-muted-foreground">• Prompt notification of users in case of any security incidents</li>
                  <li className="text-muted-foreground">• Post-incident analysis and security improvements</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Access Controls & Employee Security</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-primary/30 pl-4">
                  <h3 className="text-lg font-medium mb-2 text-foreground">Principle of Least Privilege</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All StackSeek employees have access only to the systems and data necessary for their role. 
                    Access is regularly reviewed and automatically expires.
                  </p>
                </div>
                <div className="border-l-2 border-primary/30 pl-4">
                  <h3 className="text-lg font-medium mb-2 text-foreground">Background Checks & Training</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All employees undergo background verification and receive comprehensive security training. 
                    Regular security awareness updates ensure our team stays informed about the latest threats.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-muted/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Security Certifications & Compliance</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">SOC 2 Type II</Badge>
                <Badge variant="secondary">ISO 27001</Badge>
                <Badge variant="secondary">GDPR Compliant</Badge>
                <Badge variant="secondary">CCPA Compliant</Badge>
                <Badge variant="secondary">HIPAA Ready</Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We maintain industry-standard security certifications and regularly undergo third-party 
                security audits to ensure our security posture meets the highest standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Responsible Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We believe in working with security researchers to keep StackSeek secure. If you discover a security 
                vulnerability, please report it responsibly:
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>Email:</strong> contact@stackseek.io
                  <br />
                  <strong>Response Time:</strong> We aim to respond within 24 hours
                  <br />
                  <strong>Recognition:</strong> We maintain a security hall of fame for responsible researchers
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Questions About Security?</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our security practices or need additional information for your 
                security review process, please contact us at:
                <br />
                <strong>Email:</strong> contact@stackseek.io
                <br />
                <strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM PST
                <br />
                <strong>Emergency Contact:</strong> Available 24/7 for critical security issues
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 StackSeek. Built with modern technologies for modern developers.
          </p>
        </div>
      </footer>
    </div>
  );
}