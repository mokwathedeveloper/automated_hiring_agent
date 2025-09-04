### Problem Description
The application was not consistently applying the chosen custom font across all pages, as the `body` tag was using a different font class, leading to inconsistent typography.

### Root Cause
The `body` tag in `src/app/layout.tsx` was using `className={inter.className}` instead of `className="font-sans"`, which is configured in `tailwind.config.ts` to use the 'Inter' font.

### Solution
Modified `src/app/layout.tsx` to apply `className="font-sans"` to the `body` tag, ensuring consistent application of the 'Inter' font across the entire application via Tailwind CSS.

### Commit Ref
`4fd16a31`