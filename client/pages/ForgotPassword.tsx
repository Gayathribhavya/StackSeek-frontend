import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#dcfce7",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "24px",
              }}
            >
              ✉️
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#1a1a1a",
              }}
            >
              Check your email
            </h1>
            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                marginBottom: "2rem",
                lineHeight: "1.5",
              }}
            >
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <button
              onClick={handleBackToLogin}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#7c3aed")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#8b5cf6")}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              color: "#1a1a1a",
            }}
          >
            Forgot your password?
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: isLoading ? "#9ca3af" : "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginBottom: "1.5rem",
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.backgroundColor = "#7c3aed";
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.target.style.backgroundColor = "#8b5cf6";
            }}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        {/* Footer Links */}
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          <button
            onClick={handleBackToLogin}
            style={{
              color: "#8b5cf6",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
