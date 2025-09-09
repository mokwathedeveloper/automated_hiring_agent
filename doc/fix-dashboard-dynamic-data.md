
# **Fix: Dashboard Fetches Dynamic Data**

- **Date:** 2025-09-09
- **Commit:** (will be added after commit)

## Problem

The candidate dashboard was using static, hardcoded mock data. It was not connected to the backend, preventing users from seeing their actual analyzed resumes.

## Root Cause

The component `src/components/Dashboard.tsx` contained placeholder arrays for `resumes` and `stats`. There was no API endpoint to provide this data from the database, and the component lacked data-fetching logic.

## Solution

1.  **Created a new API endpoint** at `src/app/api/resumes/route.ts` to securely fetch resume data for the authenticated user from the Supabase database.

2.  **Refactored `Dashboard.tsx`** to use the `useQuery` hook from `@tanstack/react-query` to fetch data from the new endpoint.

3.  **Replaced all mock data** with live data from the API call, including the statistics cards and the list of resumes.

4.  **Added loading and error states** to the dashboard for a better user experience during data fetching.

### Code Snippet (Dashboard.tsx data fetching)

```typescript
// Function to fetch resumes from our new API endpoint
const fetchResumes = async (): Promise<Resume[]> => {
  const response = await fetch('/api/resumes');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch resumes');
  }
  const result = await response.json();
  return result.data;
};

// useQuery hook to fetch data
const { data: resumes = [], isLoading, error } = useQuery<Resume[]>({
  queryKey: ['resumes', user?.id],
  queryFn: fetchResumes,
  enabled: !!user, // Only run the query if the user is authenticated
});
```
