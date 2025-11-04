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

export default function CookiePolicy() {
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
            <CardTitle className="text-3xl font-bold text-center">Cookie Policy</CardTitle>
            <p className="text-center text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit a website. They are widely used to make websites work more efficiently and provide 
                information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                StackSeek uses cookies to enhance your browsing experience, analyze site traffic, 
                personalize content, and remember your preferences. We use both session cookies 
                (which expire when you close your browser) and persistent cookies (which remain 
                until deleted or expired).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable 
                    basic functions like authentication, security, and remembering your preferences.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use analytics cookies to understand how visitors interact with our website. 
                    This helps us improve our services and user experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These cookies enable enhanced functionality and personalization, such as 
                    remembering your login status and preferences.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services like Google Analytics, authentication providers, 
                and other integrated services that may place their own cookies on your device. 
                These third parties have their own privacy and cookie policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Most web browsers automatically accept cookies, but you can modify your browser 
                settings to decline cookies if you prefer. You can also delete cookies that have 
                already been placed on your device.
              </p>
              <div className="mt-3">
                <p className="text-muted-foreground leading-relaxed font-medium">Browser Settings:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                  <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                  <li>Firefox: Settings → Privacy & Security → Cookies and Site Data</li>
                  <li>Safari: Preferences → Privacy → Manage Website Data</li>
                  <li>Edge: Settings → Cookies and site permissions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookie Consent</h2>
              <p className="text-muted-foreground leading-relaxed">
                By continuing to use our website, you consent to our use of cookies as described 
                in this policy. You can withdraw your consent at any time by changing your browser 
                settings or contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Impact of Disabling Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you choose to disable cookies, some features of our website may not function 
                properly. This may include login functionality, preferences, and certain interactive 
                features that rely on cookies to work correctly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Updates to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our 
                practices or applicable laws. When we make changes, we will update the "Last updated" 
                date at the top of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about our use of cookies or this Cookie Policy, 
                please contact us at privacy@stackseek.com or through our support channels.
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
              alt="StackSeek Logo"
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