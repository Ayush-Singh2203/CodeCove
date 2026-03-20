const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(helmet());
app.use(cors({
  origin: ["https://codecove-sepia.vercel.app", "http://localhost:5173", "http://localhost:4173"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.options("*", cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required'),
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CodeCove Backend API',
    version: '1.0.0',
    endpoints: {
      contact: 'POST /api/contact',
      health: 'GET /api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Contact form endpoint
app.post('/api/contact', contactValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, message } = req.body;

    await resend.emails.send({
      from: 'CodeCove <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'codecove.edu@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:10px;">New Contact Form Submission</h2>
          <div style="background:#f8fafc;padding:20px;border-radius:8px;margin:20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div style="background:#f1f5f9;padding:20px;border-radius:8px;">
            <h3 style="color:#1e40af;margin-top:0;">Message:</h3>
            <p style="line-height:1.6;color:#334155;">${message}</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Sent at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log('Contact form submitted:', { name, email, timestamp: new Date().toISOString() });

    res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CodeCove Backend Server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'development (console)'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}`);
});

module.exports = app;