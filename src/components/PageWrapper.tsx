import { ReactNode } from 'react';
import { Metadata } from 'next';
import Breadcrumb from './Breadcrumb';

interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showContainer?: boolean;
  showBreadcrumb?: boolean;
}

export default function PageWrapper({
  children,
  title,
  description,
  className = '',
  showContainer = true,
  showBreadcrumb = true
}: PageWrapperProps) {
  const content = showContainer ? (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBreadcrumb && <Breadcrumb className="mb-6" />}
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  ) : (
    <div className={className}>
      {children}
    </div>
  );

  return content;
}

// Helper function to generate metadata for pages
export function generatePageMetadata(
  title: string,
  description?: string,
  additionalKeywords?: string[]
): Metadata {
  const baseTitle = 'HiringAgent';
  const fullTitle = title === baseTitle ? title : `${title} | ${baseTitle}`;
  const defaultDescription = 'AI-powered hiring platform designed for the Nigerian job market';
  
  const keywords = [
    'hiring',
    'recruitment',
    'AI',
    'resume analysis',
    'Nigerian jobs',
    'HR technology',
    ...(additionalKeywords || [])
  ];

  return {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultDescription,
    },
  };
}
