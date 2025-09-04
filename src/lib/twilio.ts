import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Only initialize client if environment variables are properly set
const client = accountSid && authToken && accountSid.startsWith('AC') 
  ? twilio(accountSid, authToken)
  : null;

export default client;