import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !whatsappNumber) {
    return NextResponse.json({ error: 'WhatsApp service not configured' }, { status: 503 });
  }

  try {
    // Dynamic import to prevent build-time initialization
    const twilio = (await import('twilio')).default;
    const client = twilio(accountSid, authToken);

    const body = await request.formData();
    const from = body.get('From') as string;
    const messageBody = body.get('Body') as string;
    const mediaUrl = body.get('MediaUrl0') as string;
    const mediaContentType = body.get('MediaContentType0') as string;

    let responseMessage = '';

    if (mediaUrl && (mediaContentType?.includes('pdf') || mediaContentType?.includes('document'))) {
      // Handle resume upload
      responseMessage = `📄 Resume received! We're processing your document. You'll receive analysis results shortly.\n\nFor faster processing, visit our website: ${process.env.NEXT_PUBLIC_APP_URL}`;
      
      // Process media file (simplified for demo)
      await processResumeMedia(mediaUrl, from, client, whatsappNumber);
    } else if (messageBody?.toLowerCase().includes('hello') || messageBody?.toLowerCase().includes('hi')) {
      responseMessage = `👋 Welcome to Automated Hiring Agent!\n\n📋 Send us your resume (PDF/DOCX) for instant AI analysis\n🌐 Visit: ${process.env.NEXT_PUBLIC_APP_URL}\n💼 Optimized for Nigerian job market`;
    } else if (messageBody?.toLowerCase().includes('help')) {
      responseMessage = `🤖 How I can help:\n\n📄 Send resume → Get AI analysis\n📊 Score: 1-100 rating\n✅ Pros & improvement areas\n🇳🇬 Nigerian market focused\n\nSend your resume now!`;
    } else {
      responseMessage = `Thanks for your message! 📱\n\nTo get started:\n1️⃣ Send your resume (PDF/DOCX)\n2️⃣ Get instant AI analysis\n3️⃣ Improve your job prospects\n\nOr visit: ${process.env.NEXT_PUBLIC_APP_URL}`;
    }

    // Send response via WhatsApp
    await client.messages.create({
      body: responseMessage,
      from: whatsappNumber,
      to: from,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function processResumeMedia(mediaUrl: string, userPhone: string, client: any, whatsappNumber: string) {
  try {
    // Download and process resume (simplified implementation)
    const response = await fetch(mediaUrl);
    const buffer = await response.arrayBuffer();
    
    // In production, you would:
    // 1. Extract text from PDF/DOCX
    // 2. Send to OpenAI for analysis
    // 3. Store results in database
    // 4. Send analysis back via WhatsApp
    
    console.log(`Processing resume from ${userPhone}, size: ${buffer.byteLength} bytes`);
    
    // Send follow-up message
    setTimeout(async () => {
      await client.messages.create({
        body: `✅ Analysis complete!\n\n📊 Your resume has been processed. For detailed results and personalized recommendations, visit our dashboard:\n\n${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        from: whatsappNumber,
        to: userPhone,
      });
    }, 5000);
    
  } catch (error) {
    console.error('Media processing error:', error);
  }
}