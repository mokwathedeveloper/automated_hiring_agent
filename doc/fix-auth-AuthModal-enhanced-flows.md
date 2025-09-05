# Auth Modal Enhancement

## Problem Description

The previous authentication modal only supported magic link login (`signInWithOtp`). It lacked traditional email/password signup and login capabilities, limiting user options and creating confusion between the app's user authentication and the Supabase dashboard login.

## Root Cause

The initial implementation was a minimal viable product focusing on a single authentication method. The component `src/components/AuthModal.tsx` was hardcoded to only handle the magic link flow, with no UI or logic for password-based authentication or user registration.

## Solution

The `AuthModal.tsx` component was completely refactored to support multiple authentication flows:

1.  **State Management**: A new state variable `mode` (`'login' | 'signup' | 'magiclink'`) was introduced to manage the UI and logic for each flow.

2.  **Modular Functions**: The single `handleSubmit` function was replaced with three distinct handlers:
    *   `handleSignUp`: Uses `supabase.auth.signUp` for new user registration.
    *   `handleLogin`: Uses `supabase.auth.signInWithPassword` for existing users.
    *   `handleMagicLink`: Retains the `supabase.auth.signInWithOtp` functionality.

3.  **Dynamic UI**: The form now dynamically renders fields based on the selected `mode`. A password field is shown for login and signup, but hidden for the magic link flow.

4.  **Improved User Feedback**: Error and success messages are now more specific to each action, providing clearer guidance to the user.

5.  **Clear Navigation**: UI controls were added to allow users to easily switch between login, signup, and magic link options.

### Code Snippet

```typescript
// Example: handleLogin function
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  // ...
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    handleResponse(error?.message ?? null, 'Login successful! Redirecting...');
    if (!error) {
      setTimeout(() => (window.location.href = '/dashboard'), 1000);
    }
  } catch (err: any) {
    handleResponse(err.message || 'An unexpected error occurred.', '');
  } finally {
    setIsLoading(false);
  }
};
```

## Commit Reference

-   **Hash**: a37d23b9
-   **Message**: feat(auth): implement email/password and magic link flows
