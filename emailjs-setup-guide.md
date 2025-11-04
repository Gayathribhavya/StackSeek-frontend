# EmailJS Setup Guide - Direct Frontend Email Sending

The contact form is now configured to send emails directly from the frontend using EmailJS. Follow these steps to complete the setup.

## Step 1: Install EmailJS

```bash
npm install @emailjs/browser
```

## Step 2: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 3: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for testing)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**
4. Follow the connection steps
5. **Note down your Service ID** (e.g., `service_xyz123`)

## Step 4: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

**Template Name:** `contact_form`

**Subject:** `Contact Form: {{subject}}`

**Content (HTML):**
```html
<h3>New Contact Form Submission</h3>
<p><strong>Submitted:</strong> {{timestamp}}</p>
<hr>

<p><strong>Name:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Company:</strong> {{company}}</p>
<p><strong>Subject:</strong> {{subject}}</p>

<h4>Message:</h4>
<div style="background: #f5f5f5; padding: 15px; border-left: 3px solid #007cba;">
  {{message}}
</div>

<hr>
<p style="color: #666; font-size: 12px;">
  This message was sent from the StackSeek contact form.
</p>
```

4. **Set the "To Email"** to: `contact@stackseek.io`
5. Save the template
6. **Note down your Template ID** (e.g., `template_abc456`)

## Step 5: Get Public Key

1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `xyz123abc456`)

## Step 6: Update Your Code

Replace the placeholder values in `/client/pages/Contact.tsx`:

```javascript
const serviceID = 'service_xyz123'; // Your actual Service ID
const templateID = 'template_abc456'; // Your actual Template ID  
const publicKey = 'xyz123abc456'; // Your actual Public Key
```

## Step 7: Test the Form

1. Start your development server
2. Go to the Contact page
3. Fill out and submit the form
4. Check your email at contact@stackseek.io
5. Check EmailJS dashboard for delivery status

## EmailJS Template Variables

The form sends these variables to your template:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{company}}` - User's company
- `{{subject}}` - Message subject
- `{{message}}` - User's message
- `{{timestamp}}` - Submission time
- `{{to_email}}` - Your email (contact@stackseek.io)

## Free Tier Limits

EmailJS free tier includes:
- **200 emails/month**
- **2 email services**
- **1 email template**
- Basic email delivery

For higher volume, consider upgrading to a paid plan.

## Security Notes

- EmailJS public key is safe to expose in frontend code
- All emails are sent through EmailJS servers
- No sensitive credentials are stored in frontend
- Rate limiting is handled by EmailJS

## Troubleshooting

**Form not sending:**
- Check browser console for errors
- Verify Service ID, Template ID, and Public Key
- Ensure email service is connected in EmailJS dashboard

**Emails not received:**
- Check spam/junk folder
- Verify email template "To Email" field
- Check EmailJS dashboard for delivery logs

**Template variables not working:**
- Ensure variable names match exactly: `{{from_name}}`, not `{{from-name}}`
- Check template preview in EmailJS dashboard

## Production Deployment

The current setup works in production without additional configuration. The form will send emails directly from your website to contact@stackseek.io.

## Alternative: Environment Variables (Optional)

For better security, you can move the EmailJS config to environment variables:

**.env.local:**
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xyz123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_abc456
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xyz123abc456
```

**Then update Contact.tsx:**
```javascript
const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
```