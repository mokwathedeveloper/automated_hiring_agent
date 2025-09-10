# 📖 API Documentation

Complete API reference for the HiringAgent application.

## 🔗 Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## 🔐 Authentication

Most API endpoints require authentication. The application uses Supabase Auth with session-based authentication.

### Authentication Headers
```bash
# For authenticated requests
Authorization: Bearer <supabase_access_token>
```

## 👥 Candidates API

### Get All Candidates
Retrieve all candidates from the database.

**Endpoint**: `GET /api/candidates`

**Authentication**: Required (Service Role)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+254724745666",
      "skills": ["JavaScript", "React", "Node.js"],
      "work_experience": [
        {
          "company": "Tech Corp",
          "position": "Software Developer",
          "duration": "2020-2023",
          "description": "Developed web applications"
        }
      ],
      "education": [
        {
          "institution": "University of Nairobi",
          "degree": "Bachelor of Computer Science",
          "year": "2020"
        }
      ],
      "created_at": "2025-09-10T15:15:45.184827+00:00"
    }
  ],
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Failed to fetch candidates",
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}
```

### Create Candidate
Create a new candidate (typically used internally by resume parser).

**Endpoint**: `POST /api/candidates`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+254712345678",
  "skills": ["Python", "Django", "PostgreSQL"],
  "work_experience": [...],
  "education": [...]
}
```

## 📄 Resume Parsing API

### Parse Resume
Upload and parse a PDF resume to extract candidate information.

**Endpoint**: `POST /api/parse`

**Authentication**: Required

**Content-Type**: `multipart/form-data`

**Request**:
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Authorization: Bearer <token>" \
  -F "resume=@resume.pdf"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "candidate": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+254724745666",
      "skills": ["JavaScript", "React", "Node.js"],
      "work_experience": [...],
      "education": [...]
    },
    "processing_time": "2.5s",
    "file_size": "1.2MB"
  },
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}
```

**Error Responses**:
```json
// File too large
{
  "success": false,
  "error": "File size exceeds 5MB limit",
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}

// Invalid file type
{
  "success": false,
  "error": "Only PDF files are supported",
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}

// Parsing failed
{
  "success": false,
  "error": "Failed to extract text from PDF",
  "timestamp": "2025-09-10T15:15:45.184827+00:00"
}
```

### Batch Parse (Future Enhancement)
Parse multiple resumes at once.

**Endpoint**: `POST /api/parse/batch`

**Status**: Not yet implemented

## 💬 WhatsApp API

### Send Message
Send a WhatsApp message to a candidate.

**Endpoint**: `POST /api/whatsapp`

**Authentication**: Required

**Request Body**:
```json
{
  "to": "+254724745666",
  "message": "Hello! We would like to schedule an interview with you. When would be a good time this week?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "messageSid": "SM6065c7d5b935fa29c6b8281997ff66bd",
    "status": "queued",
    "to": "+254724745666",
    "message": "Message sent successfully"
  },
  "timestamp": "2025-09-10T16:02:53.175Z"
}
```

**Error Responses**:
```json
// Invalid phone number
{
  "success": false,
  "error": "Invalid phone number format. Use international format (+1234567890)",
  "timestamp": "2025-09-10T16:02:53.175Z"
}

// Twilio error
{
  "success": false,
  "error": "Failed to send message: Twilio could not find a Channel with the specified From address",
  "timestamp": "2025-09-10T16:02:53.175Z"
}

// Configuration error
{
  "success": false,
  "error": "WhatsApp service not configured. Please set up Twilio credentials.",
  "timestamp": "2025-09-10T16:02:53.175Z"
}
```

### Check WhatsApp Status
Check the configuration status of WhatsApp integration.

**Endpoint**: `GET /api/whatsapp/status`

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "data": {
    "status": {
      "configured": true,
      "accountSid": {
        "present": true,
        "valid": true
      },
      "authToken": {
        "present": true,
        "valid": true
      },
      "whatsappNumber": {
        "present": true,
        "valid": true
      }
    },
    "message": "WhatsApp is properly configured"
  },
  "timestamp": "2025-09-10T16:01:25.402Z"
}
```

## 🔐 Authentication API

### NextAuth Endpoints
Handle authentication flows.

**Endpoint**: `POST /api/auth/[...nextauth]`

**Description**: NextAuth.js dynamic API routes for authentication

**Supported Providers**:
- Email/Password (Supabase)
- Magic Link (Supabase)

### Auth Callback
Handle authentication callbacks.

**Endpoint**: `GET /api/auth/callback`

**Description**: Processes authentication callbacks and redirects users

**Query Parameters**:
- `code`: Authorization code from Supabase
- `error`: Error code if authentication failed

**Redirects**:
- Success: `/dashboard`
- Error: `/auth?error=callback_error`

## 📊 Error Handling

### Standard Error Response Format
All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE", // Optional
  "details": {}, // Optional additional details
  "timestamp": "2025-09-10T16:02:53.175Z"
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `AUTHENTICATION_ERROR` | Authentication required | 401 |
| `AUTHORIZATION_ERROR` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMIT_EXCEEDED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | External service error | 503 |

## 🔄 Rate Limiting

### Limits
- **General API**: 100 requests per 15 minutes per IP
- **File Upload**: 10 uploads per hour per user
- **WhatsApp**: 50 messages per hour per user

### Rate Limit Headers
```bash
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1694354400
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 15 minutes.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "remaining": 0,
    "resetTime": "2025-09-10T16:15:00.000Z"
  },
  "timestamp": "2025-09-10T16:02:53.175Z"
}
```

## 📝 Request/Response Examples

### Complete WhatsApp Workflow
```bash
# 1. Check WhatsApp status
curl -X GET http://localhost:3000/api/whatsapp/status

# 2. Send message if configured
curl -X POST http://localhost:3000/api/whatsapp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "to": "+254724745666",
    "message": "Hello! We would like to schedule an interview."
  }'
```

### Complete Resume Processing Workflow
```bash
# 1. Upload and parse resume
curl -X POST http://localhost:3000/api/parse \
  -H "Authorization: Bearer <token>" \
  -F "resume=@candidate_resume.pdf"

# 2. Fetch all candidates
curl -X GET http://localhost:3000/api/candidates \
  -H "Authorization: Bearer <token>"
```

## 🛠️ Development Tools

### Testing API Endpoints
```bash
# Install httpie for easier API testing
pip install httpie

# Test with httpie
http GET localhost:3000/api/candidates Authorization:"Bearer <token>"
http POST localhost:3000/api/whatsapp to="+254724745666" message="Test message"
```

### Postman Collection
Import the following collection for testing:

```json
{
  "info": {
    "name": "HiringAgent API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Candidates",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/candidates",
          "host": ["{{baseUrl}}"],
          "path": ["api", "candidates"]
        }
      }
    },
    {
      "name": "Send WhatsApp Message",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"to\": \"+254724745666\",\n  \"message\": \"Test message\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/whatsapp",
          "host": ["{{baseUrl}}"],
          "path": ["api", "whatsapp"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

**For more information, see the main [README.md](./README.md) and [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md)**
