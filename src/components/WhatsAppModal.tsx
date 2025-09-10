
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FaWhatsapp } from 'react-icons/fa';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
}

export default function WhatsAppModal({ isOpen, onClose, candidate }: WhatsAppModalProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!message) {
      setError('Message cannot be empty');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: candidate.phone,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSuccess('Message sent successfully!');
      setMessage('');
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaWhatsapp className="mr-2" /> Send WhatsApp Message to {candidate.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isSending} className="ml-2">
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
