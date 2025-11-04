import { Link } from "react-router-dom";

export default function WorkingLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/sidebar-minimized-logo.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain hover:scale-110 cursor-pointer transition-all duration-300"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
              StackSeek
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent">
                Sign In
              </button>
            </Link>
            <Link to="/register">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white rounded-md text-sm font-medium professional-button">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-8">
          <span>⚡</span>
          Now with Multi-Provider Integration
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Error Analysis
          <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Analyze, track, and resolve errors across your repositories with
          AI-powered insights. Connect GitHub, GitLab, Bitbucket, and Azure
          DevOps for intelligent error analysis.
        </p>
        <div className="flex items-center justify-center gap-3 mb-16">
          <Link to="/register">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white rounded-md font-medium text-lg professional-button">
              Start Analyzing Errors
              <span className="ml-2">→</span>
            </button>
          </Link>
          <Link to="/login">
            <button className="px-8 py-3 border border-border text-foreground rounded-md font-medium text-lg hover:bg-accent">
              Sign In
            </button>
          </Link>
        </div>

        {/* Demo Dashboard */}
        <div className="max-w-5xl mx-auto">
          <div className="border border-border rounded-lg overflow-hidden shadow-2xl bg-card">
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Interactive Dashboard
                </h3>
                <p className="text-muted-foreground text-sm">
                  Real-time error analysis and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for error analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and integrations to streamline your error
            debugging workflow
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Multi-Provider Integration
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect repositories from GitHub, GitLab, Bitbucket, and Azure
              DevOps with comprehensive authentication.
            </p>
          </div>

          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced error pattern recognition with intelligent suggestions
              for quick resolution and debugging.
            </p>
          </div>

          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Bank-grade security with encrypted credential storage and secure
              authentication protocols.
            </p>
          </div>

          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Dashboard</h3>
            <p className="text-muted-foreground leading-relaxed">
              Monitor error trends, track resolution progress, and visualize
              repository health metrics.
            </p>
          </div>

          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔑</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Flexible Authentication
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Support for tokens, SSH keys, deploy keys, and OAuth for seamless
              repository access.
            </p>
          </div>

          <div className="border border-border bg-background/50 backdrop-blur rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground leading-relaxed">
              Built on modern architecture with .NET backend for maximum
              performance and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
            Ready to streamline your error analysis?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers who are already saving hours every week
            with intelligent error insights
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <button className="px-8 py-3 bg-white text-primary rounded-md font-medium text-lg hover:bg-gray-100">
                Get Started for Free
                <span className="ml-2">→</span>
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-3 border border-white/20 text-white rounded-md font-medium text-lg hover:bg-white/10">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/sidebar-minimized-logo.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain hover:scale-110 cursor-pointer transition-all duration-300"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">StackSeek</h3>
          </div>
          <p className="text-center text-muted-foreground">
            © 2025 StackSeek. Built with modern technologies for modern
            developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
