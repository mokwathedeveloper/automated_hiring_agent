
'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FaWhatsapp, FaTimes, FaUser, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { MessageCircle, Send, X, User, Mail, Phone } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills?: string[];
  work_experience?: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Pre-defined message templates
  const messageTemplates = [
    {
      id: 'interview_invite',
      title: 'Interview Invitation',
      message: `Hi ${candidate.name}! 👋\n\nWe've reviewed your resume and are impressed with your background. We'd like to invite you for an interview.\n\nWhen would be a good time for you this week?\n\nBest regards,\nHiring Team`
    },
    {
      id: 'follow_up',
      title: 'Follow Up',
      message: `Hello ${candidate.name}! 👋\n\nThank you for your interest in our position. We're currently reviewing applications and will get back to you soon.\n\nBest regards,\nHiring Team`
    },
    {
      id: 'job_offer',
      title: 'Job Offer',
      message: `Congratulations ${candidate.name}! 🎉\n\nWe're excited to offer you the position. Please let us know if you'd like to discuss the details.\n\nBest regards,\nHiring Team`
    },
    {
      id: 'custom',
      title: 'Custom Message',
      message: ''
    }
  ];

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setSelectedTemplate(template.id);
    setMessage(template.message);
    setError(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (!candidate.phone) {
      setError('Candidate phone number is not available');
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
          message: message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSuccess('Message sent successfully! 🎉');
      setMessage('');
      setSelectedTemplate('');

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (error: any) {
      console.error('WhatsApp send error:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSelectedTemplate('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-green-600 text-base sm:text-lg">
              <FaWhatsapp className="mr-2 text-xl sm:text-2xl" />
              <span className="hidden sm:inline">Send WhatsApp Message</span>
              <span className="sm:hidden">WhatsApp</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto scrollbar-thin">
          {/* Candidate Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center">
              <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Candidate Information</span>
              <span className="sm:hidden">Candidate</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-center min-w-0">
                <User className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium truncate" title={candidate.name}>{candidate.name}</span>
              </div>
              <div className="flex items-center min-w-0">
                <Phone className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate" title={candidate.phone || 'No phone number'}>
                  {candidate.phone || 'No phone number'}
                </span>
              </div>
              <div className="flex items-center min-w-0">
                <Mail className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate" title={candidate.email}>{candidate.email}</span>
              </div>
              {candidate.work_experience && candidate.work_experience.length > 0 && (
                <div className="flex items-start min-w-0">
                  <Badge variant="outline" className="text-xs max-w-full">
                    <span className="truncate">
                      {candidate.work_experience[0].title} at {candidate.work_experience[0].company}
                    </span>
                  </Badge>
                </div>
              )}
            </div>
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto scrollbar-thin">
                  {candidate.skills.slice(0, 8).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs flex-shrink-0">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 8 && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      +{candidate.skills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Message Templates */}
          <div className="mb-4 sm:mb-6">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">Quick Templates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {messageTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                  className="justify-start h-auto p-2 sm:p-3 min-w-0"
                >
                  <div className="text-left min-w-0 w-full">
                    <div className="font-medium text-xs sm:text-sm truncate">{template.title}</div>
                    {template.id !== 'custom' && (
                      <div className="text-xs opacity-70 mt-1 line-clamp-2 sm:line-clamp-1">
                        {template.message.slice(0, 40)}...
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium mb-2">
              Message Content
            </label>
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200 text-sm sm:text-base resize-none"
              rows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 space-y-1 sm:space-y-0">
              <span className="text-xs text-gray-500">
                {message.length}/1600 characters
              </span>
              {message.length > 1600 && (
                <span className="text-xs text-red-500">
                  Message too long
                </span>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start">
                <X className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">{error}</span>
              </p>
            </div>
          )}

          {success && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm flex items-start">
                <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">{success}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSending}
              className="w-full sm:w-auto px-4 sm:px-6 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim() || message.length > 1600}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 order-1 sm:order-2"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Sending...</span>
                  <span className="sm:hidden">Sending</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Send Message</span>
                  <span className="sm:hidden">Send</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
