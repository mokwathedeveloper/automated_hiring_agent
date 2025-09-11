
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card-hover">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-green-600 dark:text-green-400">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  Send WhatsApp Message
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 button-hover"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Enhanced Candidate Info */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-muted/50 rounded-xl p-4 mb-6"
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  Candidate Information
                </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                <span className="font-medium">{candidate.name}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                <span>{candidate.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              {candidate.work_experience && candidate.work_experience.length > 0 && (
                <div className="flex items-center">
                  <Badge variant="outline">
                    {candidate.work_experience[0].title} at {candidate.work_experience[0].company}
                  </Badge>
                </div>
              )}
            </div>
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 6).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{candidate.skills.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Message Templates */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quick Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {messageTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTemplateSelect(template)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    {template.id !== 'custom' && (
                      <div className="text-xs opacity-70 mt-1">
                        {template.message.slice(0, 50)}...
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Message Content
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors duration-200"
              rows={6}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
            />
            <div className="flex justify-between items-center mt-2">
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

              {/* Enhanced Status Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
                  >
                    <p className="text-destructive text-sm flex items-center">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {error}
                    </p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                  >
                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {success}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSending}
                  className="button-hover px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !message.trim() || message.length > 1600}
                  className="button-hover bg-green-600 hover:bg-green-700 text-white px-6 shadow-lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
