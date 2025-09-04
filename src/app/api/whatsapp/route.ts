import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth';
import client from '@/lib/twilio';
import { ParsedResume } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeData, phoneNumber } = await request.json();

    if (!resumeData || !phoneNumber) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const resume: ParsedResume = resumeData;
    
    const message = `🎯 Resume Analysis Results

👤 Name: ${resume.name}
📧 Email: ${resume.email}
📱 Phone: ${resume.phone}

💼 Skills: ${resume.skills.join(', ')}

📝 Summary: ${resume.summary}

🏢 Experience:
${resume.experience.map(exp => `• ${exp.title} at ${exp.company} (${exp.duration})`).join('\n')}

🎓 Education:
${resume.education.map(edu => `• ${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}

Powered by HiringAgent AI`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
    });

    return NextResponse.json({ success: true, message: 'Resume sent to WhatsApp successfully' });
  } catch (error) {
    console.error('WhatsApp error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send WhatsApp message' }, { status: 500 });
  }
}