'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaWhatsapp } from 'react-icons/fa';
import { ParsedResume } from '@/types';

interface WhatsAppButtonProps {
  resumeData: ParsedResume;
}

export default function WhatsAppButton({ resumeData }: WhatsAppButtonProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { data: session } = useSession();

  const handleSend = async () => {
    if (!phoneNumber.trim()) {
      setMessage('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Resume sent to WhatsApp successfully!');
        setPhoneNumber('');
        setShowInput(false);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to send WhatsApp message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Login to send resume via WhatsApp</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-800 flex items-center">
          <FaWhatsapp className="mr-2" />
          Send to WhatsApp
        </h3>
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <FaWhatsapp className="mr-2" />
            Send Resume
          </button>
        )}
      </div>

      {showInput && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Phone Number (with country code)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 123 456 7890"
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              {isLoading ? 'Sending...' : 'Send'}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setMessage('');
                setPhoneNumber('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`mt-3 p-2 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}