### Fix: AuthModal `mode` prop handling

**Issue:** The `AuthModal` component was not correctly updating its internal `mode` state when the `mode` prop changed, leading to incorrect rendering (e.g., showing "Login" title when "Create Account" was expected).

**Resolution:**
1.  Modified `AuthModalProps` interface to explicitly include the `mode` prop.
2.  Updated the `AuthModal` component to initialize its internal `mode` state using the `initialMode` prop.
3.  Added a `useEffect` hook to update the internal `mode` state whenever the `initialMode` prop changes, ensuring the component reacts correctly to prop updates.
4.  Imported `useEffect` from `react` to resolve `ReferenceError: useEffect is not defined`.

**Files Modified:**
-   `src/components/AuthModal.tsx`
-   `__tests__/auth.test.tsx` (for debugging purposes, `screen.debug()` was added and then removed, and `mode` prop was passed to `AuthModal` in tests).
