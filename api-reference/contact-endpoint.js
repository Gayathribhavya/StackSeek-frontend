// Backend API Endpoint for Contact Form
// This is a reference implementation that you need to implement on your backend server

// Example using Node.js with Express and Nodemailer
// You'll need to install: npm install express nodemailer cors

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure your email transporter
const transporter = nodemailer.createTransporter({
  // For Gmail (you can use other providers)
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your email
    pass: 'your-app-password'     // Your app password (not regular password)
  }
  
  // Or for custom SMTP server:
  /*
  host: 'your-smtp-server.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@yourdomain.com',
    pass: 'your-password'
  }
  */
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, subject, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        success: false 
      });
    }

    // Email content
    const mailOptions = {
      from: email, // Sender's email
      to: 'contact@stackseek.io', // Your email
      replyTo: email, // Reply to sender's email
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <hr>
        
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        
        <h4>Message:</h4>
        <p style="background: #f5f5f5; padding: 15px; border-left: 3px solid #007cba;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          This message was sent from the StackSeek contact form.
        </p>
      `,
      text: `
New Contact Form Submission
Submitted: ${new Date(timestamp).toLocaleString()}

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Subject: ${subject}

Message:
${message}

---
This message was sent from the StackSeek contact form.
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      success: false 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Contact API' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Contact API server running on port ${PORT}`);
});

module.exports = app;