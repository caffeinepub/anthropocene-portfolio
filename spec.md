# Anthropocene Portfolio

## Current State
Full-stack Vite + React + Tailwind + Framer Motion project with:
- Home page with WebGL video mask, custom cursor, floating CTAs
- /faculty, /faculty/lectures, /faculty/students-works, /faculty/portfolio routes
- /art-practice WebGL melting gallery (React Three Fiber)
- CursorContext and VisibilityContext providers
- AnthropoceneAnchor component (top-left nav link back to /)
- TanStack Router for all routing with AnimatePresence page transitions
- No authentication or admin UI exists

## Requested Changes (Diff)

### Add
- `/admin` route: brutalist login page (pitch black bg, centered email+password form, "Enter" button)
- `/admin/dashboard` route: sidebar + main content area dashboard mockup
- AdminLogin page component
- AdminDashboard page component
- Two new routes registered in App.tsx (adminRoute, adminDashboardRoute)

### Modify
- App.tsx: register the two new admin routes in the route tree

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/pages/AdminLogin.tsx`
   - Pitch black (#000000) background, full screen
   - Centered form: "Email" input, "Password" input
   - "Enter" button: default muted border style, Laterite Red (#8C3A3A) bg on hover
   - Brutalist aesthetic: monospaced or stark sans-serif labels, minimal spacing, no rounded corners
   - On click "Enter" → navigate to /admin/dashboard (useNavigate)
   - Custom cursor text cleared (no "Click to enable sound" bleed)
   - data-ocid markers on all form inputs and button

2. Create `src/frontend/src/pages/AdminDashboard.tsx`
   - Full-height flex layout: sidebar (left) + main content (right)
   - Sidebar: Granite Grey (#1a1a1a) bg, fixed width ~220px
     - App title/logo area at top
     - Nav links: "Manage Lectures", "Manage Students Works", "Manage Art Portfolio"
     - Active link state in Laterite Red
   - Main content: pitch black bg
     - Header: "Anthropocene Control Panel" in large Stone Dust typography
     - Prominent "+ Add New Entry" button in Laterite Red (#8C3A3A)
   - data-ocid markers on sidebar links and action button

3. Register routes in App.tsx:
   - adminRoute: path "/admin" → AdminLogin
   - adminDashboardRoute: path "/admin/dashboard" → AdminDashboard
   - Add both to routeTree

4. Admin pages should NOT render the global CustomCursor "Click to enable sound" text — cursor context should be in default/dot state on these routes
