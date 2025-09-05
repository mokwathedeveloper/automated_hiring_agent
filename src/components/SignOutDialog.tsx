'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LogOut, AlertTriangle } from 'lucide-react';

interface SignOutDialogProps {
  onConfirm: () => void;
  trigger?: React.ReactNode;
}

export default function SignOutDialog({ onConfirm, trigger }: SignOutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Confirm Sign Out</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing out...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}