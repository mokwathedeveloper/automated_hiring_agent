'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FaWhatsapp, FaExternalLinkAlt, FaCopy, FaCheck } from 'react-icons/fa';
import { AlertCircle, ExternalLink, Copy, Check, Settings } from 'lucide-react';

interface WhatsAppSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppSetupGuide({ isOpen, onClose }: WhatsAppSetupGuideProps) {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-green-600">
              <FaWhatsapp className="mr-2 text-2xl" />
              WhatsApp Setup Guide
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-3 h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    WhatsApp Business API Setup Required
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    To send WhatsApp messages, you need to configure Twilio WhatsApp Business API credentials.
                    Follow the steps below to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Create Twilio Account */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Badge className="mr-2">1</Badge>
                <h3 className="font-semibold">Create a Twilio Account</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Sign up for a Twilio account and get your Account SID and Auth Token.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.twilio.com/', '_blank')}
                className="mb-3"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Twilio Console
              </Button>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm">
                <p className="font-medium mb-2">After creating your account:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Navigate to the Twilio Console Dashboard</li>
                  <li>Find your Account SID and Auth Token</li>
                  <li>Keep these credentials secure</li>
                </ul>
              </div>
            </div>

            {/* Step 2: Set up WhatsApp */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Badge className="mr-2">2</Badge>
                <h3 className="font-semibold">Set up WhatsApp Business API</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Configure WhatsApp Business API in your Twilio account.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn', '_blank')}
                className="mb-3"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                WhatsApp Setup Guide
              </Button>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>For Testing:</strong> You can use Twilio's WhatsApp Sandbox for testing.
                  For production, you'll need to get your WhatsApp Business number approved.
                </p>
              </div>
            </div>

            {/* Step 3: Configure Environment Variables */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Badge className="mr-2">3</Badge>
                <h3 className="font-semibold">Configure Environment Variables</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Add your Twilio credentials to your .env file:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400"># Twilio WhatsApp Configuration</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+your_whatsapp_number_here`, 'env')}
                      className="h-6 w-6 p-0"
                    >
                      {copiedStep === 'env' ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div>TWILIO_ACCOUNT_SID=your_account_sid_here</div>
                  <div>TWILIO_AUTH_TOKEN=your_auth_token_here</div>
                  <div>TWILIO_WHATSAPP_NUMBER=whatsapp:+your_whatsapp_number_here</div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Replace the placeholder values with:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li><code>your_account_sid_here</code> → Your Twilio Account SID (starts with AC)</li>
                    <li><code>your_auth_token_here</code> → Your Twilio Auth Token</li>
                    <li><code>your_whatsapp_number_here</code> → Your WhatsApp Business number (e.g., +14155238886 for sandbox)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4: Test the Integration */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Badge className="mr-2">4</Badge>
                <h3 className="font-semibold">Test the Integration</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                After configuring your credentials, restart your application and test sending a WhatsApp message.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  <strong>Testing Tips:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>Start with the Twilio WhatsApp Sandbox for testing</li>
                  <li>Make sure the recipient's number is verified in the sandbox</li>
                  <li>Check the Twilio Console logs for any errors</li>
                </ul>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Settings className="mr-2 h-5 w-5" />
                <h3 className="font-semibold">Troubleshooting</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Authentication Error:</p>
                  <p className="text-gray-600 dark:text-gray-400">Check that your Account SID and Auth Token are correct.</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Permission Denied:</p>
                  <p className="text-gray-600 dark:text-gray-400">Ensure the recipient number is verified in your WhatsApp sandbox.</p>
                </div>
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Invalid Phone Number:</p>
                  <p className="text-gray-600 dark:text-gray-400">Use international format with country code (e.g., +1234567890).</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close Guide
              </Button>
              <Button
                onClick={() => window.open('https://www.twilio.com/docs/whatsapp', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Twilio Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
