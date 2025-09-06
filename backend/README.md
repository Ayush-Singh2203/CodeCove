# CodeCove Backend API

A Node.js/Express backend server for handling CodeCove website contact form submissions.

## Features

- ✅ Contact form API endpoint with validation
- ✅ Email notifications using Nodemailer
- ✅ CORS configuration for frontend integration
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Security headers with Helmet
- ✅ Development and production configurations

## Quick Start

### 1. Install Dependencies

```bash
cd /workspace/backend
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your email configuration
nano .env
```

### 3. Email Configuration

#### For Gmail (Recommended):
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password":
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `.env` file:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   CONTACT_EMAIL=contact@codecove.com
   ```

#### For Development (Console logging):
Leave EMAIL_SERVICE empty or comment it out. Emails will be logged to console.

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### GET /
- **Description**: API information and available endpoints
- **Response**: JSON with API details

### GET /api/health
- **Description**: Health check endpoint
- **Response**: Server status and uptime

### POST /api/contact
- **Description**: Submit contact form
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'm interested in your courses..."
  }
  ```
- **Validation**:
  - `name`: 2-50 characters, letters and spaces only
  - `email`: Valid email format
  - `message`: 10-1000 characters
- **Response**: Success/error message

## Running with Frontend

### Terminal 1 (Backend):
```bash
cd /workspace/backend
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd /workspace/shadcn-ui
pnpm run dev
```

The frontend will be available at `http://localhost:5173` and backend at `http://localhost:3001`.

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Input Validation**: Express-validator for form data
- **Rate Limiting**: Can be added for production
- **Email Sanitization**: Prevents injection attacks

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Sender email address | - |
| `EMAIL_PASS` | Email password/app password | - |
| `CONTACT_EMAIL` | Recipient email address | `contact@codecove.com` |

## Testing the API

### Using curl:
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the API."
  }'
```

### Using the Frontend:
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Scroll to the contact form
4. Fill out and submit the form
5. Check the backend console for logs

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper email credentials
3. Set up process manager (PM2)
4. Configure reverse proxy (Nginx)
5. Enable HTTPS
6. Set up monitoring and logging

## Troubleshooting

### Common Issues:

1. **CORS Error**: Check `FRONTEND_URL` in `.env`
2. **Email Not Sending**: Verify email credentials and app password
3. **Port Already in Use**: Change `PORT` in `.env`
4. **Validation Errors**: Check request body format

### Logs:
- All requests and errors are logged to console
- Email sending status is logged
- In development mode, detailed error messages are returned

## Support

For issues or questions, please check the logs and ensure all environment variables are properly configured.