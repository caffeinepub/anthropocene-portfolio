# Anthropocene Portfolio

## Current State
- Home page has a static hero with Playfair Display "Anthropocene" title, body copy, and a bottom-docked horizontal navigation bar with three NavLink items
- Video tag exists but with empty `src` and no masking
- No custom cursor, no mouse-tracking, no masking effect
- Background is a dark stone gradient (~#1A1A1A) with grain overlay
- App has four routes: `/`, `/design`, `/art`, `/research`
- `motion` (Framer Motion v12) and `lucide-react` already installed

## Requested Changes (Diff)

### Add
- **CustomCursor component** — global, tracks `clientX/clientY` via `useMotionValue` + `useSpring`. Renders a small Stone Dust dot. Initially shows floating label "Click to enable sound & reveal". After click, label fades out and cursor shrinks to a plain dot. Cursor turns Laterite Red when hovering a floating CTA.
- **Video masking engine** — video src set to the Cloudinary URL. Wrapped in `motion.div` with `WebkitMaskImage` driven by `useMotionTemplate`. Initial `maskSize = 200px` creating flashlight effect. On click, `maskSize` animates to `3000px` (full reveal). Video starts `muted={true}`, unmutes on click.
- **Floating CTA links** — three pure-text links replacing the bottom nav bar, positioned around the center title with continuous Framer Motion `animate` floating loops (y: [-15,15,-15], x: [-5,5,-5]) at durations 6s, 8s, 10s. Each has a unique offset from center. On hover: float pauses, cursor turns Laterite Red, text color shifts.
- **Pitch black base** — `body` and page background forced to `#000000`.
- **`cursor: none` globally** applied to `*` in CSS.
- **Mobile handling** — on touch devices, page starts fully revealed (maskSize jumps to 3000px immediately, no flashlight effect).

### Modify
- `Home.tsx` — complete rewrite: remove bottom nav bar and static hero body copy. Retain centered "Anthropocene" title (fixed, high z-index). Wire video src, masking logic, and floating CTAs.
- `index.css` — set `body` background to `#000000`, add `cursor: none` globally.
- `App.tsx` — mount `CustomCursor` outside `<Routes>` so it persists across pages.

### Remove
- Bottom-docked `NavLink` component usage from Home page (the three links move to floating positions)
- Static body copy and divider from hero center

## Implementation Plan
1. Update `index.css`: set body background to `#000000`, add `* { cursor: none; }`.
2. Create `src/components/CustomCursor.tsx`: useMotionValue + useSpring for x/y, renders animated dot + label text, accepts `isRevealed` and `isHoveringCTA` props via context or ref.
3. Create `src/context/CursorContext.tsx`: shares `isRevealed`, `isHoveringCTA` state across components.
4. Rewrite `src/pages/Home.tsx`:
   - Full-screen video with Cloudinary src, autoPlay, loop, playsInline, muted state
   - `motion.div` video wrapper with `WebkitMaskImage` via `useMotionTemplate`
   - Mouse tracking with `useMotionValue` + `useSpring`
   - `maskSize` as motion value, animates 200 → 3000 on click
   - Touch detection: if touch device, skip to full reveal on mount
   - Fixed centered "Anthropocene" serif title (z-index high)
   - Three floating motion.a/Link elements positioned around center, continuous float animation, hover pause
5. Update `App.tsx` to wrap with `CursorProvider` and render `<CustomCursor />` globally.
