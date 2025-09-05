# Auth Modal: Removal of Magic Link Option

## Problem Description

The user requested the removal of the "sign in with a Magic Link" option from the authentication forms, simplifying the login/signup process to only use email and password.

## Root Cause

The previous implementation of `AuthModal.tsx` included a `magiclink` authentication mode, which provided an option for users to sign in via a one-time password sent to their email. This feature was no longer desired.

## Solution

The `AuthModal.tsx` component was modified to remove all traces of the magic link functionality:

1.  **Type Definition Update**: The `AuthMode` type was updated to exclude `'magiclink'`.
2.  **Function Removal**: The `handleMagicLink` asynchronous function, responsible for initiating the magic link flow, was removed.
3.  **UI Logic Simplification**: The `renderForm` switch statement no longer contains a `case 'magiclink'`, ensuring that this form is not rendered.
4.  **Button Removal**: All UI buttons and associated `onClick` handlers that allowed users to switch to or initiate the magic link mode were removed from the component's JSX.

This change streamlines the authentication experience, focusing solely on email and password for both login and signup.

## Commit Reference

-   **Hash**: <commit_hash_here>
-   **Message**: feat(auth): remove magic link option from AuthModal
