### Problem Description
The Navbar used inline SVGs for icons and had a less professional color scheme, lacking consistency with the new design system and overall aesthetic.

### Root Cause
Icons were not integrated from a dedicated library (`react-icons`), and color classes were not updated to the new custom palette defined in `tailwind.config.ts`.

### Solution
Integrated `react-icons` for navigation links and authentication buttons, and applied the new custom color scheme (`primary`, `gray`) for a polished, responsive, and professional Navbar.

### Commit Ref
`8b8b7049`