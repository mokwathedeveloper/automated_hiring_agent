
# Changelog

All notable changes to the Automated Hiring Agent project will be documented in this file.

## [2025-09-09] - Audit Fixes and Dashboard Enhancements

### Added

#### feat(db): create candidates view
**Commit**: (will be added after commit)
**Date**: 2025-09-09
**Description**: To align with the project blueprint, a `candidates` view was added to the database. This view joins the `users`, `profiles`, and `resumes` tables to provide a unified representation of candidate data without altering the underlying schema.

### Fixed

#### fix(dashboard): connect to live data
**Commit**: (will be added after commit)
**Date**: 2025-09-09
**Description**: The dashboard was refactored to fetch live data from a new `/api/resumes` endpoint, replacing all static mock data. Loading and error states were also added for a better user experience.

### Refactored

#### refactor(dashboard): implement shadcn/ui cards
**Commit**: (will be added after commit)
**Date**: 2025-09-09
**Description**: The dashboard UI was significantly improved by replacing the basic list of resumes with a responsive grid of `shadcn/ui` `Card` components. Each card provides a structured and detailed view of the candidate's analysis results.

---

## [2025-01-06] - Dashboard UI Enhancements

### Added

#### feat(ui/dashboard): add responsive sidebar with Shadcn/ui
**Commit**: `da3e0126`  
**Date**: 2025-01-06  
**Description**: Implements mobile collapsible drawer and desktop fixed sidebar with navigation links (Dashboard, Upload, Profile, Settings, Logout), integrates cleanly with existing grid layout using Card and Button components.

**Features**:
- Mobile: Collapsible drawer using Sheet component
- Desktop: Fixed left sidebar with navigation
- Navigation links: Dashboard, Upload Resumes, Profile, Settings
- Sign Out functionality integrated
- Responsive behavior across all breakpoints

#### feat(ui/dashboard): implement sign-out confirmation dialog
**Commit**: `f1bfa7ca`  
**Date**: 2025-01-06  
**Description**: Replaces plain Sign Out button with Shadcn/ui Dialog asking "Are you sure you want to sign out?" with Cancel/Confirm options, includes loading state and proper accessibility.

**Features**:
- Confirmation dialog with warning icon
- Cancel/Confirm action buttons
- Loading state during sign-out process
- Proper accessibility with ARIA labels
- Keyboard navigation support

#### refactor(ui/dashboard): migrate inputs to Shadcn/ui Form
**Commit**: `8f96a626`  
**Date**: 2025-01-06  
**Description**: Replaces direct state management with ProfileForm component using Form, FormField, FormItem, Input with proper validation, accessibility (aria-labels, keyboard navigation, error messages), and responsive design.

**Features**:
- Profile update form with validation
- Fields: First Name, Last Name, Email, Company, Job Title
- Real-time validation with Zod schema
- Toast notifications for success/error states
- Responsive grid layout (mobile: stacked, desktop: two-column)
- Proper accessibility compliance

### Technical Improvements

- **Components Added**:
  - `DashboardSidebar.tsx` - Responsive navigation sidebar
  - `SignOutDialog.tsx` - Confirmation dialog component
  - `ProfileForm.tsx` - Profile update form with validation
  - `Sheet.tsx` - Mobile drawer component from Shadcn/ui

- **Dependencies Added**:
  - `@hookform/resolvers` - Form validation integration

- **Responsive Design**:
  - Mobile: Stacked layout with collapsible sidebar
  - Tablet: Two-column layout with sidebar
  - Desktop: Grid layout with fixed sidebar

- **Accessibility**:
  - ARIA labels and descriptions
  - Keyboard navigation support
  - Screen reader compatibility
  - Focus management in dialogs

### Layout Changes

- **Mobile (< 1024px)**:
  - Header with hamburger menu
  - Collapsible sidebar drawer
  - Stacked content layout

- **Desktop (≥ 1024px)**:
  - Fixed left sidebar (256px width)
  - Main content area with grid layout
  - Profile form integrated below dashboard content

### Breaking Changes

None. All changes are additive and maintain backward compatibility.

### Migration Notes

- The Dashboard component now includes sidebar navigation
- Sign-out functionality requires user confirmation
- Profile updates are handled through a dedicated form component
- All form inputs use Shadcn/ui components with validation

---

## Previous Releases

### [2025-01-05] - Core Implementation
- Initial Dashboard and ResumeUploader implementation
- Shadcn/ui integration
- Responsive design foundation
- TypeScript error fixes
