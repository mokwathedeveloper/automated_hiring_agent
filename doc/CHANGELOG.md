# Changelog

All notable changes to the Automated Hiring Agent project will be documented in this file.

## [Unreleased] - 2025-09-05

### Added
- **feat(auth): implement email/password and magic link flows** (a37d23b9)
  - Implemented distinct flows for user signup (email/password), login (email/password), and magic link (OTP) in the authentication modal.

## [Day 4] - 2025-01-27

### Added
- **Testing Suite** (ef5e08da, 925504f9, 1935284a, 34189d71)
  - Comprehensive authentication unit tests
  - Nigerian resume format validation tests
  - Paystack integration and verification tests
  - WhatsApp integration tests with accessibility improvements

- **Performance Optimizations** (91163332, 81f9412f, 7295a880)
  - Rate limiting middleware for API protection (100 requests/15 minutes)
  - React Query implementation for client-side caching
  - OpenAI prompt optimization for faster processing and lower costs

- **UI Polish & Animations** (bb053fd1, 9ca23ab7, 023951aa, b8d5c452)
  - Loading skeleton components for better UX
  - Framer Motion animations for engaging user experience
  - Enhanced error message component with animations
  - Loading states and animations for uploader and pricing components

### Changed
- Optimized OpenAI API calls to use fewer tokens and reduce costs
- Improved accessibility with proper label associations
- Enhanced mobile responsiveness across all components

### Technical Improvements
- Added comprehensive test coverage for core functionality
- Implemented client-side caching to reduce API calls
- Added rate limiting to prevent API abuse
- Optimized bundle size with lazy loading

### Security
- Enhanced API protection with rate limiting
- Improved input validation and sanitization
- Added proper error handling and user feedback

## Previous Days

### [Day 3] - Authentication & Payments
- NextAuth.js integration with magic link authentication
- Paystack payment gateway integration
- User dashboard and subscription management

### [Day 2] - Core Features
- Resume parsing with OpenAI integration
- WhatsApp integration via Twilio
- File upload and validation system

### [Day 1] - Foundation
- Next.js 14 project setup
- Tailwind CSS styling
- Basic component structure
- Database schema design