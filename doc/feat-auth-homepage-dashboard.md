### Problem

Authentication was not consistently enforced across the application. The homepage's resume analysis section allowed unauthenticated access, and the dashboard displayed an "Access Denied" message instead of redirecting to a login page. This created a disjointed user experience and potential security vulnerabilities.

### Root Cause

Initial implementation focused on core functionality, with authentication being a later enhancement. The client-side authentication checks were not fully integrated with server-side enforcement, leading to inconsistencies. The dashboard's authentication flow was incomplete, showing a static message rather than a dynamic redirect.

### Solution Implemented

Authentication enforcement has been standardized across the homepage's resume analysis section and the dashboard:

- **Homepage (Resume Analysis Section):**
    - The `src/app/page.tsx` now conditionally renders the `ResumeUploader` and `ResultsDisplay` components.
    - If the user is not authenticated (and not in a loading state), a "Login Required" message is displayed with options to log in or sign up, redirecting to `/auth`.
    - This ensures that resume analysis functionality is only accessible to logged-in users.

- **Dashboard:**
    - The `src/components/Dashboard.tsx` now uses `useEffect` and `useRouter` to redirect unauthenticated users to the `/auth` page.
    - A loading spinner is displayed while the authentication status is being determined.
    - This provides a smoother and more intuitive authentication flow for dashboard access.

- **ResumeUploader (Client-Side Double Check):**
    - The `handleUpload` function in `src/components/ResumeUploader.tsx` now includes an explicit check for user authentication.
    - If the user is not authenticated, an error message is displayed, and the user is redirected to `/auth`.
    - Upon successful resume analysis, the user is now automatically redirected to the `/dashboard` page, streamlining the workflow.

### Commit Reference

[Commit Hash will be added here after commit]