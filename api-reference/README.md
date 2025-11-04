# Backend API Implementation Guide

## Contact Form Integration

The frontend contact form now sends POST requests to `/api/contact` endpoint. You need to implement this backend API to receive form submissions and send emails to contact@stackseek.io.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install express nodemailer cors
```

### 2. Environment Variables
Create a `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3001
```

### 3. Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for this application
3. Use the app password in EMAIL_PASS (not your regular password)

### 4. Alternative SMTP Providers
You can use other email providers:
- **SendGrid**
- **Mailgun** 
- **AWS SES**
- **Your hosting provider's SMTP**

### 5. Production Considerations
- Use environment variables for sensitive data
- Add rate limiting to prevent spam
- Add CAPTCHA for additional security
- Log errors for debugging
- Use HTTPS in production

## API Endpoint

**POST** `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "subject": "Partnership Inquiry",
  "message": "Hello, I'm interested in...",
  "timestamp": "2025-01-05T10:30:00.000Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "abc123"
}
```

**Error Response (400/500):**
```json
{
  "error": "Missing required fields",
  "success": false
}
```

## Testing

1. Start your backend server
2. Test the endpoint with curl:
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

## Deployment Options

1. **Vercel**: Add API routes to your Next.js app
2. **Netlify**: Use Netlify Functions
3. **Railway/Heroku**: Deploy Node.js backend
4. **Your existing server**: Integrate with current backend

## Frontend Integration Status

✅ **Completed:**
- Frontend form sends POST requests to `/api/contact`
- Form validation and error handling
- Loading states and success messages
- Automatic form reset after submission

📋 **Next Steps:**
1. Implement the backend API endpoint
2. Configure email service
3. Deploy backend
4. Test end-to-end functionality