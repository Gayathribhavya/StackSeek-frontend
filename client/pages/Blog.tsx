import { ArrowLeft, Calendar, Clock, Search, ChevronRight, BookOpen, TrendingUp, Star, Tag, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPost, setFeaturedPost] = useState(0);
  const [currentArticle, setCurrentArticle] = useState<number | null>(null);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleReadPost = (postId: number) => {
    setCurrentArticle(postId);
    window.scrollTo(0, 0);
  };

  const handleBackToBlog = () => {
    setCurrentArticle(null);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-rotate featured posts
    const interval = setInterval(() => {
      setFeaturedPost((prev) => (prev + 1) % blogPosts.filter(p => p.featured).length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const categories = ["All", "Engineering", "AI & ML", "Best Practices", "Tutorials", "Industry Insights"];

  const blogPosts = [
    {
      id: 1,
      title: "Advanced Error Handling Patterns in Modern JavaScript Applications",
      excerpt: "Explore sophisticated error handling techniques that improve application resilience and user experience.",
      author: "Priya Sharma",
      authorRole: "Senior Engineering Manager",
      publishDate: "2025-01-15",
      readTime: "12 min",
      category: "Engineering",
      featured: true,
      tags: ["JavaScript", "Error Handling", "Best Practices"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      content: `
        <h2>Introduction</h2>
        <p>Error handling is a critical aspect of building robust JavaScript applications. In this comprehensive guide, we'll explore advanced patterns and techniques that go beyond basic try-catch blocks to create resilient applications that gracefully handle unexpected situations.</p>
        
        <p>Modern JavaScript applications are complex systems that interact with APIs, process user input, and manage state across multiple components. Each of these interactions presents opportunities for errors to occur, making sophisticated error handling strategies essential for production applications.</p>

        <h2>The Foundation: Understanding Error Types</h2>
        <p>JavaScript errors fall into several categories, each requiring different handling strategies:</p>
        <ul>
          <li><strong>Syntax Errors:</strong> Caught at compile time by JavaScript engines, these prevent code execution entirely. Modern tooling like ESLint and TypeScript help catch these early.</li>
          <li><strong>Runtime Errors:</strong> Occur during execution, often due to unexpected inputs, null references, or API failures. These require defensive programming techniques.</li>
          <li><strong>Logic Errors:</strong> The most challenging to detect, these produce incorrect results without throwing exceptions. Unit testing and code reviews are crucial for prevention.</li>
          <li><strong>Asynchronous Errors:</strong> Special consideration needed for Promise rejections, async/await failures, and callback errors in event-driven code.</li>
        </ul>

        <h2>Advanced Error Handling Patterns</h2>

        <h3>1. The Result Pattern (Functional Error Handling)</h3>
        <p>Instead of throwing exceptions, return a Result type that explicitly represents success or failure. This pattern, borrowed from functional programming languages like Rust and Haskell, makes error handling explicit and forces developers to handle both success and failure cases.</p>
        
        <pre><code>class Result {
  constructor(data, error) {
    this.data = data;
    this.error = error;
    this.isSuccess = !error;
  }
  
  static success(data) {
    return new Result(data, null);
  }
  
  static failure(error) {
    return new Result(null, error);
  }
  
  map(fn) {
    return this.isSuccess ? Result.success(fn(this.data)) : this;
  }
  
  flatMap(fn) {
    return this.isSuccess ? fn(this.data) : this;
  }
  
  getOrElse(defaultValue) {
    return this.isSuccess ? this.data : defaultValue;
  }
}

// Usage examples
function parseUserData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return Result.success(data);
  } catch (error) {
    return Result.failure(new Error('Invalid JSON: ' + error.message));
  }
}

function validateUser(userData) {
  if (!userData.email) {
    return Result.failure(new Error('Email is required'));
  }
  if (!userData.name) {
    return Result.failure(new Error('Name is required'));
  }
  return Result.success(userData);
}

// Chain operations safely
const result = parseUserData(jsonInput)
  .flatMap(validateUser)
  .map(user => ({ ...user, id: generateId() }));

if (result.isSuccess) {
  console.log('User created:', result.data);
} else {
  console.error('Failed to create user:', result.error.message);
}</code></pre>

        <h3>2. Error Boundaries for React Applications</h3>
        <p>React Error Boundaries provide a way to catch JavaScript errors anywhere in the component tree, log those errors, and display a fallback UI instead of crashing the entire application.</p>

        <pre><code>import React from 'react';
import * as Sentry from '@sentry/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    Sentry.captureException(error, {
      tags: {
        component: 'ErrorBoundary'
      },
      extra: errorInfo
    });
    
    this.setState({
      error,
      errorInfo
    });
  }
  
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage with fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
      <pre className="error-details">{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}</code></pre>

        <h3>3. Centralized Error Management System</h3>
        <p>Implement a comprehensive error management system that handles different types of errors consistently across your application:</p>

        <pre><code>class ErrorManager {
  constructor() {
    this.handlers = new Map();
    this.errorQueue = [];
    this.setupGlobalHandlers();
  }
  
  setupGlobalHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        error: event.error,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        error: event.reason,
        promise: event.promise
      });
    });
    
    // Handle network errors
    window.addEventListener('offline', () => {
      this.handleError({
        type: 'network',
        error: new Error('Network connection lost')
      });
    });
  }
  
  register(errorType, handler) {
    this.handlers.set(errorType, handler);
  }
  
  handleError(errorContext) {
    const { type, error } = errorContext;
    const handler = this.handlers.get(type);
    
    // Add to error queue for batch processing
    this.errorQueue.push({
      timestamp: new Date(),
      ...errorContext
    });
    
    if (handler) {
      handler(errorContext);
    } else {
      this.defaultHandler(errorContext);
    }
    
    // Process error queue periodically
    this.processErrorQueue();
  }
  
  defaultHandler(errorContext) {
    console.error('Unhandled error:', errorContext);
    
    // Show user-friendly notification
    this.showErrorNotification(errorContext);
    
    // Log to monitoring service
    this.logToService(errorContext);
  }
  
  showErrorNotification(errorContext) {
    // Implementation depends on your notification system
    const message = this.getUserFriendlyMessage(errorContext.error);
    // toast.error(message);
  }
  
  getUserFriendlyMessage(error) {
    const errorMap = {
      'NetworkError': 'Please check your internet connection and try again.',
      'ValidationError': 'Please check your input and try again.',
      'AuthenticationError': 'Please log in again to continue.',
      'AuthorizationError': 'You do not have permission to perform this action.',
      'RateLimitError': 'Too many requests. Please try again later.'
    };
    
    return errorMap[error.constructor.name] || 'An unexpected error occurred. Please try again.';
  }
  
  processErrorQueue() {
    if (this.errorQueue.length > 10) {
      // Batch send errors to monitoring service
      this.batchLogErrors(this.errorQueue.splice(0, 10));
    }
  }
}

// Usage
const errorManager = new ErrorManager();

// Register specific error handlers
errorManager.register('api', (errorContext) => {
  if (errorContext.error.status === 401) {
    // Handle authentication errors
    redirectToLogin();
  } else if (errorContext.error.status >= 500) {
    // Handle server errors
    showMaintenanceMessage();
  }
});

errorManager.register('validation', (errorContext) => {
  // Handle form validation errors
  showFieldErrors(errorContext.error.fields);
});</code></pre>

        <h2>Async Error Handling Strategies</h2>
        
        <h3>Promise-based Error Handling</h3>
        <p>When working with Promises and async/await, it's crucial to handle errors at multiple levels:</p>

        <pre><code>// Wrapper for safer async operations
async function safeAsync(operation) {
  try {
    const result = await operation();
    return Result.success(result);
  } catch (error) {
    return Result.failure(error);
  }
}

// Retry mechanism for transient failures
async function withRetry(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// Circuit breaker pattern
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async call(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}</code></pre>

        <h2>Error Monitoring and Observability</h2>
        <p>Effective error handling isn't just about catching errors—it's about understanding them. Implement comprehensive monitoring to gain insights into error patterns:</p>

        <ul>
          <li><strong>Error Aggregation:</strong> Group similar errors to identify common issues</li>
          <li><strong>Context Preservation:</strong> Capture user actions, browser state, and application state when errors occur</li>
          <li><strong>Performance Impact:</strong> Monitor how errors affect application performance and user experience</li>
          <li><strong>Alert Thresholds:</strong> Set up intelligent alerting based on error frequency and severity</li>
        </ul>

        <h2>Best Practices for Production Applications</h2>
        <ul>
          <li><strong>Fail Fast, Fail Safe:</strong> Detect errors early and provide safe fallback mechanisms</li>
          <li><strong>Graceful Degradation:</strong> When non-critical features fail, continue providing core functionality</li>
          <li><strong>User-Centric Messaging:</strong> Provide clear, actionable error messages that help users resolve issues</li>
          <li><strong>Progressive Enhancement:</strong> Build applications that work even when JavaScript fails</li>
          <li><strong>Error Recovery:</strong> Implement automatic recovery mechanisms where possible</li>
          <li><strong>Testing Error Scenarios:</strong> Include error cases in your testing strategy</li>
          <li><strong>Documentation:</strong> Document error handling patterns and recovery procedures for your team</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Advanced error handling is not just about catching exceptions—it's about building resilient systems that provide excellent user experiences even when things go wrong. By implementing these patterns and following best practices, you create applications that are not only robust but also maintainable and user-friendly.</p>
        
        <p>Remember that error handling is an ongoing process. As your application grows and evolves, so should your error handling strategies. Regular review and improvement of your error handling patterns will pay dividends in application reliability and user satisfaction.</p>
      `
    },
    {
      id: 2,
      title: "The Future of AI-Powered Development Tools",
      excerpt: "How artificial intelligence is transforming software development workflows and debugging processes.",
      author: "Dr. Arjun Patel",
      authorRole: "AI Research Director", 
      publishDate: "2025-01-12",
      readTime: "8 min",
      category: "AI & ML",
      featured: true,
      tags: ["AI", "Machine Learning", "Developer Tools"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      content: `
        <h2>The AI Revolution in Software Development</h2>
        <p>Artificial Intelligence is fundamentally transforming how we approach software development, making processes more efficient, intelligent, and accessible to developers of all skill levels. We are witnessing a paradigm shift where AI becomes not just a tool, but a collaborative partner in the development process.</p>
        
        <p>This transformation is happening at an unprecedented pace, with new AI-powered development tools emerging regularly. From intelligent code completion to automated bug detection, AI is reshaping every aspect of the software development lifecycle.</p>

        <h2>Current State of AI Development Tools</h2>
        
        <h3>Intelligent Code Completion and Generation</h3>
        <p>Modern AI-powered code completion tools have evolved far beyond simple autocomplete functionality:</p>
        <ul>
          <li><strong>GitHub Copilot:</strong> Uses OpenAI's Codex model to suggest entire functions, classes, and even complex algorithms based on natural language comments</li>
          <li><strong>TabNine:</strong> Provides context-aware completions across multiple programming languages with deep learning models</li>
          <li><strong>Amazon CodeWhisperer:</strong> Offers real-time code suggestions optimized for AWS services and best practices</li>
          <li><strong>Replit Ghostwriter:</strong> Integrated AI assistant that can generate, explain, and refactor code within the development environment</li>
        </ul>

        <h3>Automated Bug Detection and Security Analysis</h3>
        <p>AI-powered static analysis tools are becoming increasingly sophisticated in identifying potential issues:</p>
        
        <pre><code>// Example: AI can detect potential null pointer exceptions
function processUser(user) {
  // AI Warning: Potential null reference
  // Suggestion: Add null check before accessing properties
  return user.name.toUpperCase(); // Risky without validation
}

// AI-suggested improvement
function processUser(user) {
  if (!user || !user.name) {
    throw new Error('Invalid user object');
  }
  return user.name.toUpperCase();
}</code></pre>

        <h3>Intelligent Code Review and Quality Assessment</h3>
        <p>AI-powered code review tools analyze code for multiple dimensions:</p>
        <ul>
          <li><strong>Performance Issues:</strong> Identifying inefficient algorithms and resource-heavy operations</li>
          <li><strong>Security Vulnerabilities:</strong> Detecting common security flaws like SQL injection, XSS, and authentication bypasses</li>
          <li><strong>Maintainability:</strong> Assessing code complexity, readability, and adherence to best practices</li>
          <li><strong>Test Coverage:</strong> Suggesting areas where additional testing would be beneficial</li>
        </ul>

        <h2>Emerging AI Capabilities</h2>
        
        <h3>Natural Language to Code Translation</h3>
        <p>The ability to generate functional code from natural language descriptions is rapidly improving:</p>
        
        <pre><code>// Prompt: "Create a function that validates email addresses using regex"
// AI-generated result:
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email must be a non-empty string' };
  }
  
  const isValid = emailRegex.test(email.trim());
  
  return {
    isValid,
    error: isValid ? null : 'Invalid email format'
  };
}

// AI also generates test cases
describe('validateEmail', () => {
  test('should validate correct email formats', () => {
    expect(validateEmail('user@example.com')).toEqual({ isValid: true, error: null });
    expect(validateEmail('test.user+tag@domain.co.uk')).toEqual({ isValid: true, error: null });
  });
  
  test('should reject invalid email formats', () => {
    expect(validateEmail('invalid-email')).toEqual({ isValid: false, error: 'Invalid email format' });
    expect(validateEmail('')).toEqual({ isValid: false, error: 'Email must be a non-empty string' });
  });
});</code></pre>

        <h3>Automated Documentation and Comment Generation</h3>
        <p>AI can generate comprehensive documentation that stays in sync with code changes:</p>
        
        <pre><code>/**
 * Processes user authentication with multi-factor support
 * 
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @param {string} [credentials.mfaToken] - Optional MFA token
 * @param {Object} options - Authentication options
 * @param {boolean} [options.rememberMe=false] - Whether to extend session duration
 * @param {string} [options.deviceId] - Unique device identifier for trusted devices
 * 
 * @returns {Promise<Object>} Authentication result
 * @returns {boolean} returns.success - Whether authentication succeeded
 * @returns {string} [returns.token] - JWT token if successful
 * @returns {Object} [returns.user] - User profile information
 * @returns {string} [returns.error] - Error message if authentication failed
 * 
 * @example
 * const result = await authenticateUser(
 *   { email: 'user@example.com', password: 'securePassword123' },
 *   { rememberMe: true, deviceId: 'device-123' }
 * );
 * 
 * if (result.success) {
 *   console.log('Welcome', result.user.name);
 * } else {
 *   console.error('Authentication failed:', result.error);
 * }
 * 
 * @throws {ValidationError} When credentials are invalid or missing
 * @throws {RateLimitError} When too many authentication attempts are made
 */
async function authenticateUser(credentials, options = {}) {
  // Implementation generated and documented by AI
}</code></pre>

        <h2>The Future Landscape: What's Coming Next</h2>

        <h3>AI-Powered Architecture Design</h3>
        <p>Future AI tools will help architects and senior developers design entire system architectures:</p>
        <ul>
          <li><strong>Scalability Analysis:</strong> AI will predict scaling bottlenecks and suggest architectural improvements</li>
          <li><strong>Technology Stack Optimization:</strong> Intelligent recommendations for technology choices based on project requirements</li>
          <li><strong>Microservices Decomposition:</strong> Automated analysis of monolithic applications with suggestions for service boundaries</li>
          <li><strong>Performance Modeling:</strong> Predictive performance analysis before implementation</li>
        </ul>

        <h3>Intelligent Testing and Quality Assurance</h3>
        <p>AI will revolutionize how we approach testing and quality assurance:</p>
        <ul>
          <li><strong>Automatic Test Generation:</strong> AI creates comprehensive test suites based on code analysis and user behavior patterns</li>
          <li><strong>Visual Testing:</strong> AI-powered visual regression testing that understands design intent</li>
          <li><strong>Behavior-Driven Testing:</strong> Generation of tests from user stories and business requirements</li>
          <li><strong>Performance Test Optimization:</strong> AI-guided load testing that adapts to real-world usage patterns</li>
        </ul>

        <h3>Predictive Development and Maintenance</h3>
        <p>AI will enable proactive development and maintenance approaches:</p>
        <ul>
          <li><strong>Bug Prediction:</strong> Machine learning models that predict which code areas are most likely to contain bugs</li>
          <li><strong>Refactoring Recommendations:</strong> AI suggests optimal times and methods for code refactoring</li>
          <li><strong>Dependency Management:</strong> Intelligent analysis of dependency updates and their potential impacts</li>
          <li><strong>Technical Debt Assessment:</strong> Automated identification and prioritization of technical debt</li>
        </ul>

        <h2>Challenges and Considerations</h2>
        
        <h3>Code Quality and Reliability</h3>
        <p>While AI tools are powerful, they require careful oversight:</p>
        <ul>
          <li><strong>Verification:</strong> AI-generated code must be thoroughly reviewed and tested</li>
          <li><strong>Understanding:</strong> Developers need to understand the code they're incorporating</li>
          <li><strong>Maintenance:</strong> AI-generated code still requires human maintenance and updates</li>
        </ul>

        <h3>Security and Privacy</h3>
        <p>AI development tools raise important security considerations:</p>
        <ul>
          <li><strong>Code Privacy:</strong> Ensuring sensitive code isn't exposed to AI training datasets</li>
          <li><strong>Generated Vulnerabilities:</strong> AI models may inadvertently generate insecure code patterns</li>
          <li><strong>Compliance:</strong> Ensuring AI-assisted development meets regulatory requirements</li>
        </ul>

        <h2>Preparing for the AI-Powered Future</h2>
        
        <p>To thrive in an AI-enhanced development environment, developers should:</p>
        <ul>
          <li><strong>Embrace AI Tools:</strong> Learn to effectively use AI-powered development assistants</li>
          <li><strong>Maintain Critical Thinking:</strong> Develop skills to evaluate and improve AI-generated code</li>
          <li><strong>Focus on High-Level Design:</strong> Shift focus toward architecture, user experience, and business logic</li>
          <li><strong>Continuous Learning:</strong> Stay updated with rapidly evolving AI capabilities and best practices</li>
        </ul>

        <h2>Conclusion</h2>
        <p>The future of AI-powered development tools is not about replacing developers—it's about augmenting human capabilities and enabling developers to focus on higher-level creative and strategic work. As these tools continue to evolve, they will democratize software development, making it more accessible while simultaneously enabling experienced developers to build more sophisticated and robust applications.</p>
        
        <p>The key to success in this AI-enhanced future lies in embracing these tools while maintaining the critical thinking and creative problem-solving skills that make great developers. By combining human insight with AI capabilities, we can build better software faster than ever before.</p>
      `
    },
    {
      id: 3,
      title: "Building Scalable Microservices Architecture",
      excerpt: "Essential patterns and practices for designing robust microservices that scale with your business.",
      author: "Vikram Singh",
      authorRole: "Solutions Architect",
      publishDate: "2025-01-10",
      readTime: "15 min",
      category: "Engineering",
      featured: false,
      tags: ["Microservices", "Architecture", "Scalability"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      content: `
        <h2>Introduction to Microservices Architecture</h2>
        <p>Microservices architecture has emerged as the de facto standard for building modern, scalable applications. This architectural pattern breaks down complex monolithic applications into smaller, independent services that can be developed, deployed, and scaled independently. Each service focuses on a specific business capability and communicates with other services through well-defined APIs.</p>
        
        <p>The transition from monolithic to microservices architecture represents more than just a technical shift—it's a fundamental change in how we think about software design, team organization, and system operations. Organizations adopting microservices report improved agility, faster time-to-market, and better resilience, but success requires careful planning and adherence to proven patterns.</p>

        <h2>Core Principles of Microservices Design</h2>
        
        <h3>1. Single Responsibility Principle</h3>
        <p>Each microservice should have a single, well-defined business responsibility. This principle ensures that services are focused, maintainable, and can evolve independently. When defining service boundaries, consider the following:</p>
        <ul>
          <li><strong>Business Capabilities:</strong> Align services with business functions rather than technical layers</li>
          <li><strong>Data Ownership:</strong> Each service should own its data and never share databases directly</li>
          <li><strong>Team Autonomy:</strong> Services should be small enough for a single team to own and operate</li>
          <li><strong>Independent Deployment:</strong> Changes to one service should not require coordinated deployments</li>
        </ul>

        <h3>2. Decentralized Governance and Data Management</h3>
        <p>Traditional monolithic applications often centralize decision-making and data management. Microservices embrace decentralization:</p>
        
        <pre><code>// Example: Service-specific data models
// User Service
interface User {
  id: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
}

// Order Service
interface OrderUser {
  id: string;
  email: string;
  shippingAddress: Address;
  // Only order-relevant user data
}

// Inventory Service
interface Product {
  id: string;
  sku: string;
  quantityAvailable: number;
  reservedQuantity: number;
  // Inventory-specific product data
}</code></pre>

        <h3>3. API-First Design</h3>
        <p>Well-designed APIs are the contracts that enable microservices to work together effectively:</p>
        
        <pre><code>// Example: RESTful API design for Order Service
// GET /api/v1/orders/{orderId}
// POST /api/v1/orders
// PUT /api/v1/orders/{orderId}/status
// GET /api/v1/orders?userId={userId}&status={status}

// Example: Event-driven communication
interface OrderCreatedEvent {
  eventId: string;
  timestamp: Date;
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
}

// Publisher: Order Service
class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const order = await this.repository.save(orderData);
    
    // Publish event for other services
    await this.eventBus.publish('order.created', {
      eventId: generateId(),
      timestamp: new Date(),
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      totalAmount: order.total
    });
    
    return order;
  }
}

// Subscriber: Inventory Service
class InventoryService {
  @EventHandler('order.created')
  async handleOrderCreated(event: OrderCreatedEvent) {
    for (const item of event.items) {
      await this.reserveInventory(item.productId, item.quantity);
    }
  }
}</code></pre>

        <h2>Essential Microservices Patterns</h2>
        
        <h3>1. API Gateway Pattern</h3>
        <p>An API Gateway serves as the single entry point for all client requests, handling cross-cutting concerns and routing:</p>
        
        <pre><code>// API Gateway configuration example
const gatewayConfig = {
  routes: [
    {
      path: '/api/users/*',
      target: 'http://user-service:3001',
      middleware: ['authentication', 'rateLimit']
    },
    {
      path: '/api/orders/*',
      target: 'http://order-service:3002',
      middleware: ['authentication', 'authorization', 'logging']
    },
    {
      path: '/api/inventory/*',
      target: 'http://inventory-service:3003',
      middleware: ['authentication', 'caching']
    }
  ],
  
  middleware: {
    authentication: async (req, res, next) => {
      const token = req.headers.authorization;
      const user = await validateJWT(token);
      req.user = user;
      next();
    },
    
    rateLimit: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // limit each IP to 1000 requests per windowMs
    }),
    
    caching: (req, res, next) => {
      // Implement intelligent caching logic
      next();
    }
  }
};</code></pre>

        <h3>2. Circuit Breaker Pattern</h3>
        <p>Prevent cascading failures by implementing circuit breakers for service-to-service communication:</p>
        
        <pre><code>class CircuitBreaker {
  constructor(service, options = {}) {
    this.service = service;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    this.lastFailureTime = null;
  }
  
  async call(method, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN for ' + this.service.name);
      }
    }
    
    try {
      const result = await this.service[method](...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}</code></pre>

        <h3>3. Saga Pattern for Distributed Transactions</h3>
        <p>Manage distributed transactions across multiple services using the Saga pattern:</p>
        
        <pre><code>// Choreography-based Saga example
class OrderSaga {
  constructor() {
    this.steps = [
      { service: 'inventory', action: 'reserve', compensate: 'release' },
      { service: 'payment', action: 'charge', compensate: 'refund' },
      { service: 'shipping', action: 'schedule', compensate: 'cancel' },
      { service: 'order', action: 'confirm', compensate: 'cancel' }
    ];
  }
  
  async execute(orderData) {
    const completedSteps = [];
    
    try {
      for (const step of this.steps) {
        await this.executeStep(step, orderData);
        completedSteps.push(step);
      }
      
      return { success: true, orderId: orderData.id };
    } catch (error) {
      // Compensate in reverse order
      await this.compensate(completedSteps.reverse(), orderData);
      throw new Error(\`Order processing failed: \$\{error.message\}\`);
    }
  }
  
  async executeStep(step, orderData) {
    const service = this.getService(step.service);
    return await service[step.action](orderData);
  }
  
  async compensate(completedSteps, orderData) {
    for (const step of completedSteps) {
      try {
        const service = this.getService(step.service);
        await service[step.compensate](orderData);
      } catch (compensationError) {
        // Log compensation failures for manual intervention
        console.error(\`Compensation failed for \$\{step.service\}:\`, compensationError);
      }
    }
  }
}</code></pre>

        <h2>Scaling Strategies</h2>
        
        <h3>Horizontal Scaling and Load Balancing</h3>
        <p>Design services for horizontal scaling from day one:</p>
        <ul>
          <li><strong>Stateless Services:</strong> Store session state externally (Redis, database)</li>
          <li><strong>Load Balancer Configuration:</strong> Use health checks and appropriate algorithms</li>
          <li><strong>Auto-scaling:</strong> Implement metrics-based auto-scaling policies</li>
          <li><strong>Database Scaling:</strong> Use read replicas, sharding, and caching strategies</li>
        </ul>

        <h3>Performance Optimization</h3>
        <p>Optimize for performance at the service and system levels:</p>
        
        <pre><code>// Example: Intelligent caching strategy
class CacheService {
  constructor() {
    this.localCache = new Map(); // L1 cache
    this.redisClient = new Redis(); // L2 cache
    this.cacheTTL = {
      user: 300, // 5 minutes
      product: 1800, // 30 minutes
      inventory: 60 // 1 minute
    };
  }
  
  async get(key, type, fallback) {
    // Check L1 cache first
    const localValue = this.localCache.get(key);
    if (localValue && !this.isExpired(localValue)) {
      return localValue.data;
    }
    
    // Check L2 cache
    const redisValue = await this.redisClient.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      this.localCache.set(key, parsed);
      return parsed.data;
    }
    
    // Fallback to data source
    const freshData = await fallback();
    const cacheEntry = {
      data: freshData,
      timestamp: Date.now(),
      ttl: this.cacheTTL[type] || 300
    };
    
    // Store in both caches
    this.localCache.set(key, cacheEntry);
    await this.redisClient.setex(
      key, 
      cacheEntry.ttl, 
      JSON.stringify(cacheEntry)
    );
    
    return freshData;
  }
}</code></pre>

        <h2>Monitoring and Observability</h2>
        
        <h3>Distributed Tracing</h3>
        <p>Implement comprehensive observability to understand system behavior:</p>
        
        <pre><code>// Example: OpenTelemetry integration
const { trace, context } = require('@opentelemetry/api');
const tracer = trace.getTracer('order-service', '1.0.0');

class OrderService {
  async processOrder(orderData) {
    return tracer.startActiveSpan('process-order', async (span) => {
      try {
        span.setAttributes({
          'order.id': orderData.id,
          'order.user_id': orderData.userId,
          'order.item_count': orderData.items.length,
          'order.total_amount': orderData.totalAmount
        });
        
        const validatedOrder = await this.validateOrder(orderData);
        const inventoryReservation = await this.reserveInventory(validatedOrder);
        const paymentResult = await this.processPayment(validatedOrder);
        
        span.setStatus({ code: trace.SpanStatusCode.OK });
        return await this.confirmOrder(validatedOrder, paymentResult);
      } catch (error) {
        span.recordException(error);
        span.setStatus({
          code: trace.SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}</code></pre>

        <h2>Best Practices for Production</h2>
        
        <ul>
          <li><strong>Start Small:</strong> Begin with a well-defined service and gradually extract others</li>
          <li><strong>Automate Everything:</strong> CI/CD pipelines, testing, monitoring, and deployment</li>
          <li><strong>Design for Failure:</strong> Assume services will fail and plan accordingly</li>
          <li><strong>Security by Design:</strong> Implement service-to-service authentication and authorization</li>
          <li><strong>Data Consistency:</strong> Choose appropriate consistency models for each use case</li>
          <li><strong>Documentation:</strong> Maintain API documentation and architectural decision records</li>
          <li><strong>Testing Strategy:</strong> Unit tests, integration tests, contract tests, and end-to-end tests</li>
        </ul>

        <h2>Common Pitfalls to Avoid</h2>
        
        <ul>
          <li><strong>Distributed Monolith:</strong> Services that are too tightly coupled</li>
          <li><strong>Data Inconsistency:</strong> Not properly handling eventual consistency</li>
          <li><strong>Over-Engineering:</strong> Creating too many small services too early</li>
          <li><strong>Inadequate Monitoring:</strong> Poor visibility into system behavior</li>
          <li><strong>Ignoring Network Latency:</strong> Chatty service-to-service communication</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Building scalable microservices architecture requires careful planning, disciplined implementation, and continuous refinement. By following proven patterns and best practices, organizations can create resilient, scalable systems that enable rapid development and deployment while maintaining high availability and performance.</p>
        
        <p>Remember that microservices are not a silver bullet—they solve certain problems while introducing others. The key is to understand the trade-offs and apply these patterns thoughtfully based on your specific business and technical requirements.</p>
      `
    },
    {
      id: 4,
      title: "Performance Optimization Strategies for React Applications",
      excerpt: "Proven techniques to improve React app performance and deliver better user experiences.",
      author: "Ananya Gupta",
      authorRole: "Frontend Architect",
      publishDate: "2025-01-08",
      readTime: "10 min",
      category: "Best Practices",
      featured: false,
      tags: ["React", "Performance", "Optimization"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      content: `
        <h2>Understanding React Performance Bottlenecks</h2>
        <p>React applications can suffer from performance issues that significantly impact user experience. Common bottlenecks include unnecessary re-renders, heavy computations in render cycles, inefficient state updates, and poor component architecture. Understanding these issues is the first step toward building high-performance React applications.</p>
        
        <p>Performance optimization in React isn't just about making things faster—it's about creating smooth, responsive user interfaces that feel native and delightful to use. The techniques we'll explore can dramatically improve your application's perceived performance and actual metrics.</p>

        <h2>Component Optimization Strategies</h2>
        
        <h3>1. Memoization with React.memo and useMemo</h3>
        <p>Prevent unnecessary re-renders by memoizing components and expensive computations:</p>
        
        <pre><code>// Component memoization
const ExpensiveUserCard = React.memo(({ user, onUpdate }) => {
  console.log('UserCard render:', user.id);
  
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onUpdate(user.id)}>Update</button>
    </div>
  );
});

// Custom comparison for complex props
const UserList = React.memo(({ users, onUserUpdate }) => {
  return (
    <div className="user-list">
      {users.map(user => (
        <ExpensiveUserCard
          key={user.id}
          user={user}
          onUpdate={onUserUpdate}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.users.length === nextProps.users.length &&
    prevProps.users.every((user, index) => 
      user.id === nextProps.users[index].id &&
      user.updatedAt === nextProps.users[index].updatedAt
    )
  );
});</code></pre>

        <h3>2. Efficient State Management</h3>
        <p>Optimize state updates to minimize re-renders across your component tree:</p>
        
        <pre><code>// Problem: Single state object causes unnecessary re-renders
const BadExample = () => {
  const [state, setState] = useState({
    users: [],
    loading: false,
    filters: { search: '', category: 'all' },
    ui: { selectedId: null, modalOpen: false }
  });
  
  // Any state change re-renders everything
  const updateSearch = (search) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, search }
    }));
  };
};

// Solution: Separate state concerns
const OptimizedExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', category: 'all' });
  const [ui, setUi] = useState({ selectedId: null, modalOpen: false });
  
  // More granular updates
  const updateSearch = useCallback((search) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);
  
  // Further optimize with useReducer for complex state
  const [appState, dispatch] = useReducer(appReducer, initialState);
};

// Advanced: State management with context optimization
const UserContext = createContext();
const FilterContext = createContext();
const UIContext = createContext();

// Split contexts to prevent unnecessary re-renders
const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: 'all' });
  const [ui, setUi] = useState({ selectedId: null, modalOpen: false });
  
  return (
    <UserContext.Provider value={{ users, setUsers }}>
      <FilterContext.Provider value={{ filters, setFilters }}>
        <UIContext.Provider value={{ ui, setUi }}>
          {children}
        </UIContext.Provider>
      </FilterContext.Provider>
    </UserContext.Provider>
  );
};</code></pre>

        <h3>3. Virtual Scrolling for Large Lists</h3>
        <p>Handle large datasets efficiently with virtual scrolling:</p>
        
        <pre><code>// Custom virtual scrolling hook
const useVirtualScrolling = (items, containerHeight, itemHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  
  useEffect(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);
    
    setVisibleRange({ start, end });
  }, [scrollTop, containerHeight, itemHeight, items.length]);
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};

// Usage in component
const VirtualizedList = ({ items, itemHeight = 50 }) => {
  const containerRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualScrolling(items, containerHeight, itemHeight);
  
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, []);
  
  return (
    <div
      ref={containerRef}
      className="virtual-list-container"
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: \`translateY(\$\{offsetY\}px)\`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};</code></pre>

        <h2>Advanced Performance Techniques</h2>
        
        <h3>1. Code Splitting and Lazy Loading</h3>
        <p>Reduce initial bundle size with strategic code splitting:</p>
        
        <pre><code>// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

// Component-based code splitting
const HeavyChart = lazy(() => 
  import('./components/HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);

// Conditional loading
const AdminPanel = lazy(() => {
  return import('./components/AdminPanel');
});

// App component with suspense boundaries
const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Preloading for better UX
const usePreloadRoute = (routeComponent) => {
  const preload = useCallback(() => {
    routeComponent();
  }, [routeComponent]);
  
  return preload;
};

// Usage
const Navigation = () => {
  const preloadDashboard = usePreloadRoute(() => import('./pages/Dashboard'));
  
  return (
    <nav>
      <Link 
        to="/dashboard" 
        onMouseEnter={preloadDashboard}
      >
        Dashboard
      </Link>
    </nav>
  );
};</code></pre>

        <h3>2. Optimizing Bundle Size</h3>
        <p>Analyze and optimize your bundle for better loading performance:</p>
        
        <pre><code>// Tree shaking with proper imports
// Bad: imports entire library
import * as _ from 'lodash';
import { Button } from '@material-ui/core';

// Good: imports only needed functions
import debounce from 'lodash/debounce';
import Button from '@material-ui/core/Button';

// Webpack bundle analyzer configuration
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE_BUNDLE ? 'server' : 'disabled',
      openAnalyzer: false,
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        }
      }
    }
  }
};</code></pre>

        <h3>3. Image and Asset Optimization</h3>
        <p>Optimize media assets for better performance:</p>
        
        <pre><code>// Progressive image loading
const LazyImage = ({ src, alt, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, placeholder, src]);
  
  const handleLoad = () => {
    setLoaded(true);
  };
  
  return (
    <div className={\`image-container \$\{loaded ? 'loaded' : ''\}\`}>
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        style={{
          opacity: loaded ? 1 : 0.3,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

// WebP with fallback
const OptimizedImage = ({ src, alt, ...props }) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
};</code></pre>

        <h2>Performance Monitoring and Debugging</h2>
        
        <h3>Web Vitals and Performance Metrics</h3>
        <p>Monitor key performance metrics to identify issues:</p>
        
        <pre><code>// Performance monitoring utility
const PerformanceMonitor = {
  // Core Web Vitals
  measureWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
          // Send to analytics
        }
      });
    }).observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  },
  
  // Custom performance marks
  markFeature(featureName) {
    performance.mark(\`\$\{featureName\}-start\`);
    
    return () => {
      performance.mark(\`\$\{featureName\}-end\`);
      performance.measure(
        featureName,
        \`\$\{featureName\}-start\`,
        \`\$\{featureName\}-end\`
      );
      
      const measurement = performance.getEntriesByName(featureName)[0];
      console.log(\`\$\{featureName\} took \$\{measurement.duration\}ms\`);
    };
  }
};

// React DevTools Profiler API
const ProfiledComponent = ({ children }) => {
  const handleRender = (id, phase, actualDuration) => {
    if (actualDuration > 16) { // Flag slow renders
      console.warn(\`Slow render detected: \$\{id\} took \$\{actualDuration\}ms\`);
    }
  };
  
  return (
    <Profiler id="ProfiledComponent" onRender={handleRender}>
      {children}
    </Profiler>
  );
};</code></pre>

        <h2>Best Practices Summary</h2>
        
        <ul>
          <li><strong>Measure First:</strong> Use React DevTools Profiler to identify actual performance bottlenecks</li>
          <li><strong>Minimize Re-renders:</strong> Use React.memo, useMemo, and useCallback strategically</li>
          <li><strong>Optimize State:</strong> Keep state updates granular and close to where they're needed</li>
          <li><strong>Code Splitting:</strong> Split large bundles and lazy load non-critical features</li>
          <li><strong>Asset Optimization:</strong> Compress images, use modern formats, and implement lazy loading</li>
          <li><strong>Monitor Performance:</strong> Continuously monitor Web Vitals and user experience metrics</li>
          <li><strong>Progressive Enhancement:</strong> Ensure core functionality works without JavaScript</li>
        </ul>

        <h2>Common Performance Anti-Patterns</h2>
        
        <ul>
          <li><strong>Premature Optimization:</strong> Optimizing without measuring actual performance issues</li>
          <li><strong>Over-Memoization:</strong> Memoizing everything, including cheap computations</li>
          <li><strong>Large Bundle Sizes:</strong> Including unnecessary dependencies or not tree-shaking</li>
          <li><strong>Inefficient Loops:</strong> Performing expensive operations inside render methods</li>
          <li><strong>Memory Leaks:</strong> Not cleaning up event listeners, timeouts, or subscriptions</li>
        </ul>

        <h2>Conclusion</h2>
        <p>React performance optimization is an iterative process that requires careful measurement, strategic application of optimization techniques, and continuous monitoring. By understanding React's rendering behavior and applying these proven techniques, you can build applications that provide exceptional user experiences even under heavy load.</p>
        
        <p>Remember that performance optimization should be driven by real user metrics and actual bottlenecks, not theoretical concerns. Focus on the optimizations that provide the most impact for your specific use case and user base.</p>
      `
    },
    {
      id: 5,
      title: "Implementing Zero-Downtime Deployments",
      excerpt: "A comprehensive guide to deployment strategies that ensure continuous service availability.",
      author: "Rohit Kumar",
      authorRole: "DevOps Engineer",
      publishDate: "2025-01-05",
      readTime: "13 min",
      category: "Best Practices",
      featured: false,
      tags: ["DevOps", "Deployment", "CI/CD"],
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop",
      content: `
        <h2>Understanding Zero-Downtime Deployments</h2>
        <p>Zero-downtime deployment is a deployment strategy that allows you to update your production applications without any service interruption. In today's always-on digital world, even brief outages can result in lost revenue, poor user experience, and damage to your brand reputation. This comprehensive guide covers proven strategies and implementation techniques for achieving true zero-downtime deployments.</p>
        
        <p>The key to successful zero-downtime deployments lies in careful planning, robust infrastructure, and automated processes that can handle the complexity of updating live systems while maintaining service availability.</p>

        <h2>Core Deployment Strategies</h2>
        
        <h3>1. Blue-Green Deployment</h3>
        <p>Blue-green deployment maintains two identical production environments, switching traffic between them during updates:</p>
        
        <pre><code>// Infrastructure as Code example (Terraform)
resource "aws_lb_target_group" "blue" {
  name     = "app-blue"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

resource "aws_lb_target_group" "green" {
  name     = "app-green"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }
}

// Deployment script
class BlueGreenDeployer {
  constructor(config) {
    this.config = config;
    this.currentEnvironment = null;
    this.targetEnvironment = null;
  }
  
  async deploy(version) {
    console.log(\`Starting blue-green deployment for version \$\{version\}\`);
    
    // Determine current and target environments
    await this.determineEnvironments();
    
    try {
      // Deploy to inactive environment
      await this.deployToEnvironment(this.targetEnvironment, version);
      
      // Run health checks
      await this.verifyDeployment(this.targetEnvironment);
      
      // Switch traffic
      await this.switchTraffic();
      
      // Verify production traffic
      await this.verifyProductionTraffic();
      
      console.log('Blue-green deployment completed successfully');
    } catch (error) {
      console.error('Deployment failed, rolling back...');
      await this.rollback();
      throw error;
    }
  }
  
  async determineEnvironments() {
    const activeTarget = await this.getActiveTargetGroup();
    this.currentEnvironment = activeTarget === 'blue' ? 'blue' : 'green';
    this.targetEnvironment = activeTarget === 'blue' ? 'green' : 'blue';
  }
  
  async switchTraffic() {
    // Gradually shift traffic (canary-style)
    const trafficPercentages = [10, 25, 50, 75, 100];
    
    for (const percentage of trafficPercentages) {
      await this.updateLoadBalancerWeights(percentage);
      await this.wait(30000); // Wait 30 seconds
      await this.checkErrorRates();
    }
  }
}</code></pre>

        <h3>2. Rolling Deployment</h3>
        <p>Gradually update instances one by one while maintaining service availability:</p>
        
        <pre><code>// Kubernetes rolling deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 6
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2        # Can have 2 extra pods during update
      maxUnavailable: 1  # At most 1 pod can be unavailable
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v2.0
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10

// Custom rolling deployment script
class RollingDeployer {
  constructor(instances, batchSize = 1) {
    this.instances = instances;
    this.batchSize = batchSize;
    this.deployedInstances = [];
  }
  
  async deploy(version) {
    const batches = this.createBatches();
    
    for (const batch of batches) {
      console.log('Deploying batch: ' + batch.join(', '));
      
      try {
        // Deploy new version to batch
        await Promise.all(
          batch.map(instance => this.deployToInstance(instance, version))
        );
        
        // Wait for health checks
        await this.waitForHealthy(batch);
        
        // Add to load balancer
        await this.addToLoadBalancer(batch);
        
        // Monitor for issues
        await this.monitorBatch(batch, 60000); // Monitor for 1 minute
        
        this.deployedInstances.push(...batch);
        
      } catch (error) {
        console.error('Batch deployment failed: ' + error.message);
        await this.rollbackBatch(batch);
        throw error;
      }
    }
  }
  
  createBatches() {
    const batches = [];
    for (let i = 0; i < this.instances.length; i += this.batchSize) {
      batches.push(this.instances.slice(i, i + this.batchSize));
    }
    return batches;
  }
}</code></pre>

        <h3>3. Canary Deployment</h3>
        <p>Test new versions with a small percentage of users before full rollout:</p>
        
        <pre><code>// Canary deployment with feature flags
class CanaryDeployer {
  constructor(config) {
    this.config = config;
    this.canaryPercentage = 0;
    this.metrics = new MetricsCollector();
  }
  
  async deploy(version) {
    const canaryStages = [5, 10, 25, 50, 100];
    
    try {
      // Deploy canary version
      await this.deployCanaryVersion(version);
      
      for (const percentage of canaryStages) {
        console.log('Increasing canary traffic to ' + percentage + '%');
        
        // Update traffic routing
        await this.updateTrafficSplit(percentage);
        
        // Collect metrics
        const metrics = await this.collectMetrics(300000); // 5 minutes
        
        // Validate metrics
        const isHealthy = await this.validateCanaryMetrics(metrics);
        
        if (!isHealthy) {
          throw new Error('Canary metrics indicate issues');
        }
        
        // Wait before next stage
        if (percentage < 100) {
          await this.wait(600000); // Wait 10 minutes
        }
      }
      
      console.log('Canary deployment completed successfully');
    } catch (error) {
      console.error('Canary deployment failed, rolling back...');
      await this.rollbackCanary();
      throw error;
    }
  }
  
  async validateCanaryMetrics(metrics) {
    const thresholds = {
      errorRate: 0.01,      // 1% error rate
      latencyP99: 500,      // 500ms p99 latency
      throughputDrop: 0.1   // 10% throughput drop
    };
    
    return (
      metrics.canary.errorRate <= thresholds.errorRate &&
      metrics.canary.latencyP99 <= thresholds.latencyP99 &&
      (metrics.canary.throughput / metrics.stable.throughput) >= (1 - thresholds.throughputDrop)
    );
  }
  
  async updateTrafficSplit(canaryPercentage) {
    // Update load balancer or ingress controller
    await this.updateIngressWeights({
      stable: 100 - canaryPercentage,
      canary: canaryPercentage
    });
    
    this.canaryPercentage = canaryPercentage;
  }
}</code></pre>

        <h2>Database Migration Strategies</h2>
        
        <h3>Backward-Compatible Migrations</h3>
        <p>Handle database changes without downtime using backward-compatible approaches:</p>
        
        <pre><code>// Multi-phase database migration
class DatabaseMigration {
  // Phase 1: Add new column (backward compatible)
  async addColumn() {
    await this.db.query('ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE');
    
    // Populate new column for existing records
    await this.db.query('UPDATE users SET email_verified = TRUE WHERE email IS NOT NULL AND created_at < NOW() - INTERVAL \'7 days\'');
  }
  
  // Phase 2: Update application code to use new column
  // (Deploy application update)
  
  // Phase 3: Remove old column (after confirming new code works)
  async removeOldColumn() {
    // Wait for all instances to be updated
    await this.waitForDeploymentComplete();
    
    await this.db.query('ALTER TABLE users DROP COLUMN old_email_status');
  }
}

// Schema versioning approach
class SchemaVersionManager {
  constructor(database) {
    this.db = database;
  }
  
  async migrateWithVersioning(targetVersion) {
    const currentVersion = await this.getCurrentSchemaVersion();
    const migrations = await this.getMigrations(currentVersion, targetVersion);
    
    for (const migration of migrations) {
      await this.executeInTransaction(async (trx) => {
        // Execute migration
        await migration.up(trx);
        
        // Update version
        await this.updateSchemaVersion(migration.version, trx);
        
        console.log('Applied migration: ' + migration.name);
      });
    }
  }
  
  async executeInTransaction(operation) {
    const trx = await this.db.transaction();
    try {
      await operation(trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}</code></pre>

        <h2>Health Checks and Monitoring</h2>
        
        <h3>Comprehensive Health Check Implementation</h3>
        <p>Implement robust health checks to ensure deployment success:</p>
        
        <pre><code>// Comprehensive health check endpoint
class HealthChecker {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }
  
  async getHealthStatus(req, res) {
    const startTime = Date.now();
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION,
      uptime: process.uptime(),
      checks: {}
    };
    
    try {
      // Check database connectivity
      health.checks.database = await this.checkDatabase();
      
      // Check external services
      health.checks.externalAPIs = await this.checkExternalAPIs();
      
      // Check memory usage
      health.checks.memory = await this.checkMemoryUsage();
      
      // Check disk space
      health.checks.disk = await this.checkDiskSpace();
      
      // Determine overall status
      const hasFailures = Object.values(health.checks)
        .some(check => check.status !== 'healthy');
      
      health.status = hasFailures ? 'unhealthy' : 'healthy';
      health.responseTime = Date.now() - startTime;
      
      return res.status(hasFailures ? 503 : 200).json(health);
    } catch (error) {
      health.status = 'unhealthy';
      health.error = error.message;
      return res.status(503).json(health);
    }
  }
  
  async checkDatabase() {
    try {
      const start = Date.now();
      await this.dependencies.db.raw('SELECT 1');
      return {
        status: 'healthy',
        responseTime: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
  
  async checkExternalAPIs() {
    const apis = [
      { name: 'payment-service', url: process.env.PAYMENT_API_URL },
      { name: 'user-service', url: process.env.USER_API_URL }
    ];
    
    const checks = {};
    
    await Promise.all(
      apis.map(async (api) => {
        try {
          const start = Date.now();
          const response = await fetch(api.url + '/health', {
            timeout: 5000
          });
          
          checks[api.name] = {
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: Date.now() - start,
            statusCode: response.status
          };
        } catch (error) {
          checks[api.name] = {
            status: 'unhealthy',
            error: error.message
          };
        }
      })
    );
    
    return checks;
  }
}</code></pre>

        <h2>Automated Rollback Strategies</h2>
        
        <h3>Intelligent Rollback System</h3>
        <p>Implement automated rollback based on metrics and health checks:</p>
        
        <pre><code>class AutomatedRollback {
  constructor(config) {
    this.config = config;
    this.monitoring = new MonitoringService(config.monitoring);
    this.rollbackTriggers = [];
  }
  
  async monitorDeployment(deploymentId, duration = 300000) {
    const startTime = Date.now();
    const monitoringInterval = 30000; // Check every 30 seconds
    
    const monitoringLoop = setInterval(async () => {
      try {
        const metrics = await this.monitoring.getMetrics(startTime);
        const shouldRollback = await this.evaluateRollbackConditions(metrics);
        
        if (shouldRollback.required) {
          console.log('Rollback triggered: ' + shouldRollback.reason);
          clearInterval(monitoringLoop);
          await this.executeRollback(deploymentId, shouldRollback.reason);
          return;
        }
        
        if (Date.now() - startTime >= duration) {
          console.log('Monitoring period completed successfully');
          clearInterval(monitoringLoop);
          return;
        }
      } catch (error) {
        console.error('Error during monitoring:', error);
        clearInterval(monitoringLoop);
        await this.executeRollback(deploymentId, 'Monitoring error');
      }
    }, monitoringInterval);
  }
  
  async evaluateRollbackConditions(metrics) {
    const conditions = [
      {
        name: 'Error Rate',
        condition: metrics.errorRate > this.config.thresholds.maxErrorRate,
        message: 'Error rate ' + metrics.errorRate + ' exceeds threshold ' + this.config.thresholds.maxErrorRate
      },
      {
        name: 'Response Time',
        condition: metrics.avgResponseTime > this.config.thresholds.maxResponseTime,
        message: 'Response time ' + metrics.avgResponseTime + 'ms exceeds threshold ' + this.config.thresholds.maxResponseTime + 'ms'
      },
      {
        name: 'Throughput Drop',
        condition: metrics.throughputDrop > this.config.thresholds.maxThroughputDrop,
        message: 'Throughput drop ' + metrics.throughputDrop + ' exceeds threshold ' + this.config.thresholds.maxThroughputDrop
      },
      {
        name: 'Health Check',
        condition: metrics.healthCheckFailures > this.config.thresholds.maxHealthCheckFailures,
        message: 'Health check failures ' + metrics.healthCheckFailures + ' exceeds threshold'
      }
    ];
    
    const failedCondition = conditions.find(condition => condition.condition);
    
    return failedCondition 
      ? { required: true, reason: failedCondition.message }
      : { required: false };
  }
}</code></pre>

        <h2>CI/CD Pipeline Integration</h2>
        
        <h3>Complete Zero-Downtime Pipeline</h3>
        <p>Integrate zero-downtime deployment into your CI/CD pipeline:</p>
        
        <pre><code># GitHub Actions example
name: Zero-Downtime Deployment

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          npm install
          npm run test
          npm run test:integration
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Image
        run: |
          docker build -t myapp:${'{'}{'{'} github.sha {'}'}{'}'}{ } .
          docker tag myapp:${'{'}{'{'} github.sha {'}'}{'}'}{ } myapp:latest
      
      - name: Push to Registry
        run: |
          docker push myapp:${'{'}{'{'} github.sha {'}'}{'}'}{
          docker push myapp:latest
  
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          ./deploy.sh staging myapp:${'{'}{'{'} github.sha {'}'}{'}'}{
      
      - name: Run Smoke Tests
        run: |
          npm run test:smoke -- --env=staging
  
  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Blue-Green Deploy to Production
        run: |
          ./deploy-blue-green.sh production myapp:${'{'}{'{'} github.sha {'}'}{'}'}{
      
      - name: Monitor Deployment
        run: |
          ./monitor-deployment.sh production ${'{'}{'{'} github.sha {'}'}{'}'}{ } 10m
      
      - name: Rollback on Failure
        if: failure()
        run: |
          ./rollback.sh production</code></pre>

        <h2>Best Practices and Considerations</h2>
        
        <ul>
          <li><strong>Stateless Applications:</strong> Design applications to be stateless for easier scaling and deployment</li>
          <li><strong>Database Compatibility:</strong> Ensure database changes are backward compatible during transitions</li>
          <li><strong>Configuration Management:</strong> Use external configuration that can be updated without redeployment</li>
          <li><strong>Load Balancer Health Checks:</strong> Configure appropriate health check intervals and thresholds</li>
          <li><strong>Monitoring and Alerting:</strong> Implement comprehensive monitoring during deployments</li>
          <li><strong>Rollback Planning:</strong> Always have a tested rollback strategy</li>
          <li><strong>Feature Flags:</strong> Use feature flags to control feature rollouts independently of deployments</li>
        </ul>

        <h2>Common Pitfalls to Avoid</h2>
        
        <ul>
          <li><strong>Insufficient Testing:</strong> Not testing deployment procedures in staging environments</li>
          <li><strong>Database Lock-in:</strong> Making incompatible database changes during deployment</li>
          <li><strong>Session State Issues:</strong> Not handling user sessions during instance updates</li>
          <li><strong>Inadequate Monitoring:</strong> Missing critical metrics during deployment</li>
          <li><strong>Rushed Rollbacks:</strong> Not having automated rollback procedures</li>
        </ul>

        <h2>Conclusion</h2>
        <p>Zero-downtime deployment is essential for modern applications that require high availability. By implementing proven strategies like blue-green, rolling, and canary deployments, combined with robust monitoring and automated rollback capabilities, you can achieve reliable, zero-downtime updates to your production systems.</p>
        
        <p>The key to success lies in thorough testing, comprehensive monitoring, and having well-defined rollback procedures. Start with simple strategies and gradually adopt more sophisticated approaches as your infrastructure and processes mature.</p>
      `
    },
    {
      id: 6,
      title: "Database Design Principles for High-Performance Applications",
      excerpt: "Learn fundamental database design patterns that ensure optimal performance at scale.",
      author: "Kavya Nair",
      authorRole: "Database Architect",
      publishDate: "2025-01-03",
      readTime: "11 min",
      category: "Engineering",
      featured: false,
      tags: ["Database", "Performance", "Architecture"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
      content: `
        <h2>Foundations of High-Performance Database Design</h2>
        <p>Database design is the backbone of any successful application. Poor database design can cripple even the most well-architected systems, while excellent design can make applications fly. This comprehensive guide covers the fundamental principles and advanced techniques for designing databases that scale efficiently and perform exceptionally under heavy load.</p>
        
        <p>Modern applications face unprecedented data volumes and user loads. Understanding how to design databases that can handle these challenges while maintaining consistency, performance, and reliability is crucial for any serious developer or architect.</p>

        <h2>Core Database Design Principles</h2>
        
        <h3>1. Normalization and Denormalization Balance</h3>
        <p>Understanding when to normalize and when to denormalize is crucial for performance optimization:</p>
        
        <pre><code>-- Normalized approach (3NF)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Strategic denormalization for performance
CREATE TABLE order_summary_materialized (
    user_id INTEGER,
    user_email VARCHAR(255),
    user_name VARCHAR(200),
    total_orders INTEGER,
    total_spent DECIMAL(12,2),
    last_order_date TIMESTAMP,
    avg_order_value DECIMAL(10,2),
    PRIMARY KEY (user_id),
    INDEX idx_user_email (user_email),
    INDEX idx_total_spent (total_spent DESC),
    INDEX idx_last_order (last_order_date DESC)
);

-- Trigger to maintain materialized view
CREATE TRIGGER update_order_summary
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION refresh_order_summary();</code></pre>

        <h3>2. Indexing Strategies</h3>
        <p>Implement intelligent indexing for optimal query performance:</p>
        
        <pre><code>-- Composite indexes for complex queries
CREATE INDEX idx_orders_user_status_date 
    ON orders (user_id, status, created_at DESC);

-- Partial indexes for specific conditions
CREATE INDEX idx_orders_pending 
    ON orders (created_at DESC) 
    WHERE status = 'pending';

-- Expression indexes for computed values
CREATE INDEX idx_users_email_domain 
    ON users (LOWER(SPLIT_PART(email, '@', 2)));

-- Full-text search indexes
CREATE INDEX idx_products_search 
    ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Analyzing index usage
-- Query to find unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
FROM pg_stat_user_indexes 
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexname::regclass) DESC;

-- Query to find missing indexes (high seq_scan)
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    seq_tup_read / seq_scan as avg_read_per_scan
FROM pg_stat_user_tables 
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;</code></pre>

        <h3>3. Query Optimization Techniques</h3>
        <p>Design queries that perform efficiently at scale:</p>
        
        <pre><code>-- Inefficient query (avoid)
SELECT u.*, p.*, COUNT(o.id) as order_count
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, p.id;

-- Optimized version with strategic joins and subqueries
SELECT 
    u.id,
    u.email,
    u.created_at,
    p.first_name,
    p.last_name,
    COALESCE(os.order_count, 0) as order_count,
    COALESCE(os.total_spent, 0) as total_spent
FROM users u
INNER JOIN user_profiles p ON u.id = p.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as order_count,
        SUM(total_amount) as total_spent
    FROM orders 
    WHERE created_at > '2024-01-01'
    GROUP BY user_id
) os ON u.id = os.user_id
WHERE u.created_at > '2024-01-01';

-- Using window functions for analytical queries
SELECT 
    user_id,
    order_id,
    total_amount,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as order_rank,
    SUM(total_amount) OVER (PARTITION BY user_id) as user_total_spent,
    AVG(total_amount) OVER (PARTITION BY user_id) as user_avg_order
FROM orders
WHERE created_at >= NOW() - INTERVAL '1 year';</code></pre>

        <h2>Scaling Strategies</h2>
        
        <h3>1. Horizontal Partitioning (Sharding)</h3>
        <p>Distribute data across multiple database instances for scalability:</p>
        
        <pre><code>-- Time-based partitioning
CREATE TABLE orders_2024_q1 (
    CHECK (created_at >= '2024-01-01' AND created_at < '2024-04-01')
) INHERITS (orders);

CREATE TABLE orders_2024_q2 (
    CHECK (created_at >= '2024-04-01' AND created_at < '2024-07-01')
) INHERITS (orders);

-- Hash-based sharding implementation
class DatabaseSharding {
  constructor(shards) {
    this.shards = shards;
    this.shardCount = shards.length;
  }
  
  getShardForUser(userId) {
    const hash = this.hashFunction(userId);
    return this.shards[hash % this.shardCount];
  }
  
  async queryUserOrders(userId) {
    const shard = this.getShardForUser(userId);
    return await shard.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
  }
  
  async queryAllShards(query, params) {
    const results = await Promise.all(
      this.shards.map(shard => shard.query(query, params))
    );
    
    return results.flatMap(result => result.rows);
  }
  
  hashFunction(input) {
    // Simple hash function (use crypto.createHash for production)
    let hash = 0;
    const str = input.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}</code></pre>

        <h3>2. Read Replicas and Load Distribution</h3>
        <p>Implement read replicas to distribute query load:</p>
        
        <pre><code>class DatabaseLoadBalancer {
  constructor(master, replicas) {
    this.master = master;
    this.replicas = replicas;
    this.replicaIndex = 0;
  }
  
  // Write operations go to master
  async write(query, params) {
    return await this.master.query(query, params);
  }
  
  // Read operations distributed across replicas
  async read(query, params, options = {}) {
    if (options.requireMaster || this.replicas.length === 0) {
      return await this.master.query(query, params);
    }
    
    // Round-robin selection of replica
    const replica = this.replicas[this.replicaIndex];
    this.replicaIndex = (this.replicaIndex + 1) % this.replicas.length;
    
    try {
      return await replica.query(query, params);
    } catch (error) {
      console.warn('Replica query failed, falling back to master:', error);
      return await this.master.query(query, params);
    }
  }
  
  // Transaction handling (must use master)
  async transaction(operations) {
    const client = await this.master.connect();
    try {
      await client.query('BEGIN');
      
      const results = [];
      for (const operation of operations) {
        const result = await client.query(operation.query, operation.params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}</code></pre>

        <h3>3. Caching Strategies</h3>
        <p>Implement multi-level caching for optimal performance:</p>
        
        <pre><code>class DatabaseCache {
  constructor(redisClient, localCache) {
    this.redis = redisClient;
    this.localCache = localCache; // In-memory cache
    this.cacheTTL = {
      user: 300,      // 5 minutes
      product: 1800,  // 30 minutes
      static: 3600    // 1 hour
    };
  }
  
  async get(key, type, fallback) {
    // L1: Check local cache
    const localValue = this.localCache.get(key);
    if (localValue && !this.isExpired(localValue)) {
      return localValue.data;
    }
    
    // L2: Check Redis cache
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      this.localCache.set(key, parsed);
      return parsed.data;
    }
    
    // L3: Fetch from database
    const freshData = await fallback();
    
    // Store in both caches
    const cacheEntry = {
      data: freshData,
      timestamp: Date.now(),
      ttl: this.cacheTTL[type] || 300
    };
    
    this.localCache.set(key, cacheEntry);
    await this.redis.setex(key, cacheEntry.ttl, JSON.stringify(cacheEntry));
    
    return freshData;
  }
  
  async invalidate(pattern) {
    // Invalidate local cache
    if (pattern === '*') {
      this.localCache.clear();
    } else {
      // Pattern-based invalidation
      for (const key of this.localCache.keys()) {
        if (key.includes(pattern)) {
          this.localCache.delete(key);
        }
      }
    }
    
    // Invalidate Redis cache
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}</code></pre>

        <h2>Advanced Performance Techniques</h2>
        
        <h3>1. Connection Pooling and Management</h3>
        <p>Optimize database connections for high-concurrency applications:</p>
        
        <pre><code>const { Pool } = require('pg');

class DatabaseConnectionManager {
  constructor(config) {
    this.pools = {};
    this.config = config;
    this.setupPools();
  }
  
  setupPools() {
    // Master pool for writes
    this.pools.master = new Pool({
      ...this.config.master,
      max: 20,                    // Maximum connections
      min: 5,                     // Minimum connections
      idleTimeoutMillis: 30000,   // Close idle connections after 30s
      connectionTimeoutMillis: 2000, // Timeout for new connections
      maxUses: 7500,              // Close connection after 7500 uses
      allowExitOnIdle: false
    });
    
    // Read replica pools
    this.pools.replicas = this.config.replicas.map((replicaConfig, index) => 
      new Pool({
        ...replicaConfig,
        max: 15,
        min: 3,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        maxUses: 7500,
        allowExitOnIdle: false
      })
    );
  }
  
  async query(sql, params, options = {}) {
    const pool = options.write ? this.pools.master : this.getReadPool();
    
    const start = Date.now();
    try {
      const result = await pool.query(sql, params);
      const duration = Date.now() - start;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn('Slow query detected (' + duration + 'ms):', sql);
      }
      
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
  
  getReadPool() {
    // Round-robin selection
    const index = Math.floor(Math.random() * this.pools.replicas.length);
    return this.pools.replicas[index];
  }
  
  async healthCheck() {
    const checks = [];
    
    // Check master
    checks.push(
      this.pools.master.query('SELECT 1')
        .then(() => ({ type: 'master', status: 'healthy' }))
        .catch(error => ({ type: 'master', status: 'unhealthy', error }))
    );
    
    // Check replicas
    this.pools.replicas.forEach((pool, index) => {
      checks.push(
        pool.query('SELECT 1')
          .then(() => ({ type: 'replica-' + index, status: 'healthy' }))
          .catch(error => ({ type: 'replica-' + index, status: 'unhealthy', error }))
      );
    });
    
    return await Promise.all(checks);
  }
}</code></pre>

        <h2>Data Modeling Best Practices</h2>
        
        <h3>1. Domain-Driven Design Principles</h3>
        <p>Align database design with business domains and bounded contexts:</p>
        
        <pre><code>-- User Management Domain
CREATE SCHEMA user_management;

CREATE TABLE user_management.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_management.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES user_management.users(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Management Domain
CREATE SCHEMA order_management;

CREATE TABLE order_management.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- Reference to user domain
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'processing', 
    'shipped', 'delivered', 'cancelled', 'refunded'
);</code></pre>

        <h2>Monitoring and Optimization</h2>
        
        <h3>Database Performance Monitoring</h3>
        <p>Implement comprehensive monitoring for database performance:</p>
        
        <pre><code>-- PostgreSQL performance monitoring queries
-- Top slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    stddev_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Lock monitoring
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity 
    ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
    ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity 
    ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.GRANTED;</code></pre>

        <h2>Security Considerations</h2>
        
        <ul>
          <li><strong>Data Encryption:</strong> Encrypt sensitive data at rest and in transit</li>
          <li><strong>Access Control:</strong> Implement role-based access control (RBAC)</li>
          <li><strong>SQL Injection Prevention:</strong> Always use parameterized queries</li>
          <li><strong>Audit Logging:</strong> Track all database access and modifications</li>
          <li><strong>Backup Security:</strong> Secure and test database backups regularly</li>
        </ul>

        <h2>Best Practices Summary</h2>
        
        <ul>
          <li><strong>Design for Scale:</strong> Consider future growth in initial design</li>
          <li><strong>Monitor Continuously:</strong> Implement comprehensive performance monitoring</li>
          <li><strong>Index Strategically:</strong> Create indexes based on actual query patterns</li>
          <li><strong>Test at Scale:</strong> Load test with realistic data volumes</li>
          <li><strong>Plan for Failure:</strong> Implement proper backup and disaster recovery</li>
          <li><strong>Document Everything:</strong> Maintain clear documentation of schema and decisions</li>
        </ul>

        <h2>Conclusion</h2>
        <p>High-performance database design is a combination of understanding fundamental principles, applying proven patterns, and continuously monitoring and optimizing based on real-world usage. By following these principles and techniques, you can build database systems that scale efficiently and perform exceptionally under demanding conditions.</p>
        
        <p>Remember that database optimization is an iterative process. Start with solid foundations, measure performance continuously, and optimize based on actual bottlenecks rather than assumptions.</p>
      `
    }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const currentFeatured = featuredPosts[featuredPost] || featuredPosts[0];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // If viewing a specific article, show the full article view
  if (currentArticle) {
    const article = blogPosts.find(post => post.id === currentArticle);
    if (!article) return <div>Article not found</div>;

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button onClick={handleBackToBlog} variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 hover:bg-accent/50">
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Blog
            </Button>
          </div>
          <ThemeToggle />
        </header>

        {/* Article Content */}
        <article className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16 py-12 sm:py-16 antialiased">
          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-6">
              <Badge variant="secondary" className="mb-6 text-sm px-3 py-1">{article.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-[1.2] tracking-tight font-['Inter',sans-serif]">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 mb-6 leading-[1.6] font-normal max-w-4xl font-['Inter',sans-serif]">
              {article.excerpt}
            </p>
            
            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{article.author}</p>
                <p className="text-sm text-muted-foreground">{article.authorRole}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishDate)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {article.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-muted rounded-full">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg dark:prose-invert max-w-none font-['Inter',sans-serif]
                       prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                       prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6 prose-h1:leading-[1.2] prose-h1:font-bold
                       prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-5 prose-h2:leading-[1.3] prose-h2:font-semibold
                       prose-h3:text-xl prose-h3:mt-7 prose-h3:mb-4 prose-h3:leading-[1.4] prose-h3:font-medium
                       prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:leading-[1.5]
                       prose-p:text-foreground/85 prose-p:leading-[1.7] prose-p:mb-5 prose-p:text-base prose-p:font-normal prose-p:text-justify
                       prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-base
                       prose-em:text-foreground/80 prose-em:italic
                       prose-ul:my-6 prose-ul:space-y-2 prose-ul:pl-5
                       prose-li:text-foreground/85 prose-li:leading-[1.6] prose-li:text-base prose-li:relative prose-li:pl-2 prose-li:text-justify
                       prose-ol:my-6 prose-ol:space-y-2 prose-ol:pl-5
                       prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic 
                       prose-blockquote:my-6 prose-blockquote:bg-muted/30 prose-blockquote:py-3 prose-blockquote:rounded-r-lg
                       prose-code:text-sm prose-code:bg-muted/70 prose-code:px-2 prose-code:py-1 prose-code:rounded-md 
                       prose-code:text-foreground prose-code:font-mono prose-code:font-medium prose-code:border prose-code:border-border/30
                       prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900 prose-pre:p-6 prose-pre:rounded-lg 
                       prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:text-sm prose-pre:leading-relaxed
                       prose-pre:border prose-pre:border-border prose-pre:shadow-md prose-pre:font-mono
                       prose-table:my-6 prose-table:border-collapse prose-table:w-full prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden
                       prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-sm
                       prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-3 prose-td:text-sm
                       prose-a:text-primary prose-a:no-underline prose-a:font-medium hover:prose-a:text-primary/80 hover:prose-a:underline 
                       prose-a:transition-all prose-a:duration-200
                       prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                       [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                       [&_pre_code]:text-green-400 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0
                       selection:bg-primary/20"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border/50">
            <div className="text-center space-y-6">
              <p className="text-base text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Thank you for reading! We hope you found this article helpful. 
                Feel free to share your thoughts or questions in the comments below.
              </p>
              <div className="flex justify-center">
                <Button onClick={handleBackToBlog} variant="outline" className="px-6 py-2 text-sm">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to All Articles
                </Button>
              </div>
            </div>
          </footer>
        </article>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-8 mt-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/final-transparent-logo.png"
                alt="Stack Seek Logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-center text-muted-foreground text-base">
              © 2025 StackSeek Engineering Blog. Built with passion for technology.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed height to match other pages */}
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
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Engineering Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              In-depth technical articles, best practices, and insights from our engineering team
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {currentFeatured && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Featured Article</span>
              </div>
            </div>
            
            <Card className="overflow-hidden border-primary/20 bg-background">
              <div className="md:flex">
                <div className="md:w-2/3">
                  <img
                    src={currentFeatured.image}
                    alt={currentFeatured.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/3">
                  <CardHeader className="pb-4">
                    <div className="mb-3">
                      <Badge variant="secondary">{currentFeatured.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-3 leading-tight">
                      {currentFeatured.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-4">
                      {currentFeatured.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{currentFeatured.author}</p>
                        <p className="text-xs text-muted-foreground">{currentFeatured.authorRole}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(currentFeatured.publishDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {currentFeatured.readTime}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4" size="sm" onClick={() => handleReadPost(currentFeatured.id)}>
                      Read Article
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight mb-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-full">
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishDate)}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => handleReadPost(post.id)}>
                      Read More
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center py-12">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Stay Updated with Latest Insights
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get the latest articles, technical insights, and best practices delivered to your inbox weekly.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button>
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                No spam, unsubscribe at any time.
              </p>
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
              className="h-8 w-auto"
            />
          </div>
          <p className="text-center text-muted-foreground text-base">
            © 2025 StackSeek Engineering Blog. Built with passion for technology.
          </p>
        </div>
      </footer>
    </div>
  );
}