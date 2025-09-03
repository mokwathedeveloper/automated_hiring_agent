# CHANGELOG

All notable changes to the Automated Hiring Agent project are documented in this file.

## [Unreleased] - 2024-01-XX

### Fixed

#### 2024-01-XX - Missing Global Stylesheet
- **Commit**: `40a89cb` - style: introduce global stylesheet globals.css
- **Description**: Added missing `src/app/globals.css` file with Tailwind CSS directives and theme support. This resolves the module resolution error in `layout.tsx` that was trying to import a non-existent stylesheet.

#### 2024-01-XX - Next.js Configuration Setup  
- **Commit**: `1e558e3` - feat: implement FileUploadForm component and wire it in page.tsx
- **Description**: Created essential Next.js and TypeScript configuration files (`next.config.js`, `tsconfig.json`) to enable proper module resolution for the `@/components/FileUploadForm` import path. Added app directory support and path mapping configuration.

#### 2024-01-XX - Missing Favicon Asset
- **Commit**: `57eb405` - chore: add missing favicon.ico to public directory  
- **Description**: Added `public/favicon.ico` file to prevent 404 errors when browsers request the site icon. Downloaded standard favicon from Next.js official source.

#### 2024-01-XX - TypeScript and Configuration Issues
- **Commit**: `03c5864` - fix: resolve TypeScript buffer type error and remove deprecated config
- **Description**: Fixed TypeScript compilation error in API route by properly converting ArrayBuffer to Buffer for pdf-parse and mammoth libraries. Removed deprecated `appDir` experimental flag from Next.js configuration.

### Summary
This release addresses three critical module resolution issues that were preventing the Next.js application from building and running properly:
1. Missing global CSS file import
2. Missing TypeScript/Next.js configuration for path aliases  
3. Missing favicon asset in public directory

All fixes follow Next.js best practices and maintain the existing application architecture.