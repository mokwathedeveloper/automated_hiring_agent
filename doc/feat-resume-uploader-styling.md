### Problem Description
The Resume Uploader component used an inline SVG for its upload icon and its color scheme was not fully aligned with the new custom palette, impacting visual consistency and professionalism.

### Root Cause
The upload icon was not integrated from `react-icons`, and color classes were not updated to the new custom palette defined in `tailwind.config.ts`.

### Solution
Replaced the inline SVG with a `react-icons` component (`FaCloudUploadAlt`) and updated color classes to use the new `primary` and `gray` palette for a consistent, professional, and responsive look for the Resume Uploader.

### Commit Ref
[Commit hash will be added here after commit]