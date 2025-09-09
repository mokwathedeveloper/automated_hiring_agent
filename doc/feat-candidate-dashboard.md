### Problem

The existing dashboard (`src/components/Dashboard.tsx`) was designed to display resume analysis history, primarily showing summarized resume data and scores. It used mock data or fetched from a `/api/resumes` endpoint that provided limited structured candidate information. The UI was not fully optimized for managing a list of candidates with detailed profiles, lacking proper search, filtering, and a professional table view.

### Root Cause

The initial focus was on resume processing and analysis, leading to a dashboard tailored for that purpose. As the project evolved to include a dedicated `candidates` table, the dashboard needed to be refactored to leverage this new data structure and provide a more comprehensive candidate management interface.

### Solution Implemented

The `src/components/Dashboard.tsx` component has been significantly refactored to serve as a dedicated Candidate Dashboard. Key changes include:

- **Data Source:** Switched from fetching `Resume` data to `Candidate` data from a new `/api/candidates` endpoint, which directly queries the `public.candidates` table in Supabase.
- **Data Display:** The `CandidateCard` component was updated to display comprehensive candidate details including name, email, phone, work experience, skills, and education. The dashboard now dynamically renders either a grid of `CandidateCard`s (for mobile and tablet views) or a Shadcn/ui `Table` (for desktop view) to present candidate data.
- **Search and Filtering:** The search functionality was enhanced to filter candidates based on their name, email, phone, and skills, providing a more effective way to navigate the candidate list.
- **UI/UX Enhancements:** Utilized Shadcn/ui components (`Card`, `Table`, `Input`, `Badge`) to create a professional and responsive user interface. The custom `Badge` component was replaced with the Shadcn/ui `Badge`.
- **Dynamic Routes:** Ensured that the `/api/candidates` endpoint is treated as a dynamic server route by adding `export const dynamic = 'force-dynamic';` to prevent static optimization issues during build.

### Commit Reference

[Commit Hash will be added here after commit]