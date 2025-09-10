# WhatsApp Integration Setup Guide

This guide will help you set up WhatsApp messaging functionality in your HiringAgent dashboard.

## 🚀 Quick Start

1. **Create a Twilio Account**: Sign up at [Twilio Console](https://console.twilio.com/)
2. **Get Your Credentials**: Find your Account SID and Auth Token
3. **Set Up WhatsApp**: Configure WhatsApp Business API
4. **Update Environment Variables**: Add credentials to your `.env` file
5. **Test the Integration**: Send your first WhatsApp message!

## 📋 Prerequisites

- Twilio account (free trial available)
- WhatsApp Business number (or use Twilio Sandbox for testing)
- Node.js application with environment variables support

## 🔧 Step-by-Step Setup

### Step 1: Create Twilio Account

1. Go to [https://console.twilio.com/](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number
4. Navigate to the Console Dashboard

### Step 2: Get Your Twilio Credentials

1. In the Twilio Console, find your **Account SID** and **Auth Token**
2. Copy these values (you'll need them for the environment variables)

### Step 3: Set Up WhatsApp Business API

#### Option A: Use Twilio Sandbox (For Testing)
1. Go to **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Follow the instructions to join the Twilio Sandbox
3. Use the sandbox number: `whatsapp:+14155238886`

#### Option B: Production WhatsApp Business API
1. Go to **Messaging** > **WhatsApp** > **Senders**
2. Request access to WhatsApp Business API
3. Follow Twilio's approval process
4. Get your approved WhatsApp Business number

### Step 4: Update Environment Variables

Add these variables to your `.env` file:

```bash
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+your_whatsapp_number_here
```

**Replace the placeholder values with:**
- `your_account_sid_here` → Your Twilio Account SID (starts with `AC`)
- `your_auth_token_here` → Your Twilio Auth Token
- `your_whatsapp_number_here` → Your WhatsApp number (e.g., `+14155238886` for sandbox)

### Step 5: Restart Your Application

After updating the environment variables:
```bash
npm run dev
```

## 🧪 Testing

### Using Twilio Sandbox
1. Send "join [sandbox-keyword]" to +1 415 523 8886 from your WhatsApp
2. Use the dashboard to send a test message
3. Check that you receive the message on WhatsApp

### Using Production Number
1. Ensure your WhatsApp Business number is approved
2. Test with verified recipient numbers
3. Monitor Twilio Console for delivery status

## 🎯 Features

### Dashboard Integration
- **Status Indicator**: Shows if WhatsApp is configured
- **Setup Guide**: Built-in guide accessible from dashboard
- **Message Templates**: Pre-defined templates for common scenarios
- **Real-time Status**: Live configuration checking

### Message Templates
- **Interview Invitation**: Professional interview scheduling
- **Follow Up**: Application status updates
- **Job Offer**: Congratulations and next steps
- **Custom Message**: Fully customizable content

### Error Handling
- **Authentication Errors**: Clear feedback for credential issues
- **Permission Errors**: Guidance for number verification
- **Rate Limiting**: Automatic throttling protection
- **Validation**: Phone number format checking

## 🔍 Troubleshooting

### Common Issues

#### "Authentication failed"
- **Cause**: Incorrect Account SID or Auth Token
- **Solution**: Double-check credentials in Twilio Console

#### "Permission denied"
- **Cause**: Recipient number not verified in sandbox
- **Solution**: Have recipient join sandbox or use approved numbers

#### "Invalid phone number format"
- **Cause**: Phone number not in international format
- **Solution**: Use format `+[country_code][number]` (e.g., `+1234567890`)

#### "WhatsApp service not configured"
- **Cause**: Environment variables not set or contain placeholders
- **Solution**: Update `.env` file with real credentials

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   # Verify variables are loaded
   echo $TWILIO_ACCOUNT_SID
   ```

2. **Test API Endpoint**:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/status
   ```

3. **Check Twilio Console**:
   - Go to Messaging > Logs
   - Look for error messages and delivery status

4. **Verify Phone Numbers**:
   - Ensure international format (+country_code + number)
   - Check sandbox verification status

## 📚 API Reference

### WhatsApp Status Endpoint
```
GET /api/whatsapp/status
```
Returns configuration status and validation results.

### Send Message Endpoint
```
POST /api/whatsapp
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Hello from HiringAgent!"
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit credentials to version control
2. **Rate Limiting**: Built-in protection against spam
3. **Input Validation**: All inputs are sanitized and validated
4. **Error Handling**: Sensitive information is not exposed in errors

## 💡 Tips

- Start with Twilio Sandbox for testing
- Use message templates for consistency
- Monitor Twilio Console for delivery insights
- Keep phone numbers in international format
- Test with different recipients before production

## 🆘 Support

If you need help:
1. Check the [Twilio Documentation](https://www.twilio.com/docs/whatsapp)
2. Use the built-in setup guide in the dashboard
3. Review Twilio Console logs for detailed error information
4. Ensure all environment variables are correctly set

## 🎉 Success!

Once configured, you'll be able to:
- Send WhatsApp messages directly from the dashboard
- Use professional message templates
- Track message delivery status
- Manage candidate communications efficiently

Happy messaging! 🚀
