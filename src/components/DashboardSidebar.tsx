'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  BarChart3, 
  Upload, 
  Settings, 
  LogOut, 
  Menu,
  Home,
  User
} from 'lucide-react';
import SignOutDialog from './SignOutDialog';

interface SidebarProps {
  onSignOut: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Upload Resumes',
    href: '/',
    icon: Upload,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

function SidebarContent({ onSignOut, className = '' }: SidebarProps & { className?: string }) {
  const pathname = usePathname();

  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">HiringAgent</h2>
          <p className="text-sm text-muted-foreground">AI-Powered Recruitment</p>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Button
                key={item.name}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </nav>
        
        <div className="pt-4 border-t">
          <SignOutDialog onConfirm={onSignOut} />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardSidebar({ onSignOut }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent onSignOut={onSignOut} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <SidebarContent onSignOut={onSignOut} className="sticky top-6" />
      </div>
    </>
  );
}