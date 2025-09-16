'use client';

import Link from 'next/link';
import { useState, lazy, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  LayoutDashboard,
  DollarSign,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Menu,
  X,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

// Lazy load AuthModal to reduce initial bundle size
const AuthModal = lazy(() => import('./AuthModal'));

export type AuthMode = 'login' | 'signup';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <nav className="navbar-glass sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center space-x-3 navbar-logo-hover">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/90 rounded-xl flex items-center justify-center shadow-professional">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">HiringAgent</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              <Link href="/" className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center rounded-lg hover:bg-accent">
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Home</span>
              </Link>
              <Link href="/dashboard" className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Dashboard</span>
              </Link>
              <Link href="/pricing" className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                <DollarSign className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Pricing</span>
              </Link>
              <Link href="/contact" className="group relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground">
                <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex md:items-center md:space-x-3">
              <ThemeToggle />
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted/50">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate max-w-32">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="button-hover"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMode("login");
                      setIsAuthModalOpen(true);
                    }}
                    className="button-hover"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setMode("signup");
                      setIsAuthModalOpen(true);
                    }}
                    className="button-hover bg-primary hover:bg-primary/90 text-primary-foreground shadow-professional"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hamburger-button"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                <div className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}>
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu with optimized animations */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-accent transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 mr-3" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-accent transition-colors flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-accent transition-colors flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <DollarSign className="w-4 h-4 mr-3" />
              Pricing
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium rounded-lg hover:bg-accent transition-colors flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              <Mail className="w-4 h-4 mr-3" />
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-border">
              <div className="flex items-center justify-between px-3 py-2">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate max-w-32">
                      {user.email}
                    </span>
                  </div>
                ) : null}
              </div>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start text-base font-medium"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMode("login");
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-base font-medium"
                  >
                    <LogIn className="w-4 h-4 mr-3" />
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("signup");
                      setIsAuthModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start text-base font-medium bg-gradient-to-r from-primary to-primary/90"
                  >
                    <UserPlus className="w-4 h-4 mr-3" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lazy load AuthModal only when needed */}
      {isAuthModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            mode={mode}
          />
        </Suspense>
      )}
    </nav>
  );
}