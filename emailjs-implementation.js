// EmailJS Implementation for Contact Form
// Replace the handleSubmit function in Contact.tsx with this after installing EmailJS

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    // EmailJS configuration - replace with your actual values from EmailJS dashboard
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
    
    // Check if EmailJS is configured
    if (serviceID.includes('YOUR_') || templateID.includes('YOUR_') || publicKey.includes('YOUR_')) {
      throw new Error('EmailJS not configured. Please set up your EmailJS credentials.');
    }
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      company: formData.company || 'Not provided',
      subject: formData.subject,
      message: formData.message,
      to_email: 'contact@stackseek.io',
      timestamp: new Date().toLocaleString()
    };

    // Import EmailJS dynamically (only works after npm install @emailjs/browser)
    const emailjs = await import('@emailjs/browser');
    
    const response = await emailjs.send(
      serviceID,
      templateID, 
      templateParams,
      publicKey
    );

    if (response.status === 200) {
      setIsLoading(false);
      alert("Thank you for your message! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    setIsLoading(false);
    console.error('Contact form error:', error);
    
    // Fallback to mailto if EmailJS fails
    const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}

---
Submitted: ${new Date().toLocaleString()}
This message was sent from the StackSeek contact form.
    `);
    
    const mailtoLink = `mailto:contact@stackseek.io?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    
    alert("EmailJS not configured. Opening your email client to send the message to contact@stackseek.io");
  }
};