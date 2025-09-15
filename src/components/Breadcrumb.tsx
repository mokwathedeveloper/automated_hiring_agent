'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);
  
  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumb for home page or single-level pages
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/" 
        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  
  // Map of path segments to display names
  const pathLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'pricing': 'Pricing',
    'contact': 'Contact',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'auth': 'Authentication',
    'profile': 'Profile',
    'settings': 'Settings',
  };
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    items.push({
      label,
      href: currentPath,
    });
  });
  
  return items;
}
