# Anthropocene Portfolio

## Current State
- Research page has a confirmation overlay (pitch-black) before the floating canvas
- Research background is pure black with a dot-grid texture
- No background music on the Research page
- Design Portfolio cards use a vertical stacked layout (media on top, text meta below)
- DesignPortfolioItem in Motoko has no `description` field
- Admin form for Design Portfolio has no description input
- FacultyPortfolio renders a masonry grid of vertical cards

## Requested Changes (Diff)

### Add
- Research welcome screen: sketchbook background image (`/assets/uploads/background-image-1.jpg`) at ~0.15 opacity with dark overlay, visible as textural backdrop behind the confirmation UI
- Research ambient audio: `eryliaa-forest-birds-with-wind-and-crickets-445147.mp3` auto-plays at low diffused volume when Research page loads; continues into the floating canvas; mute/unmute button at bottom-right
- `description` field to `DesignPortfolioItem` type in Motoko backend
- Description input to the Admin "Add Design Portfolio" form
- Split-card layout for Design Portfolio: left side (65%) shows media (Figma iframe / image / video); right side (35%) shows description text
- Expand/collapse behaviour on the media zone: Maximize2 icon in top-right of the media zone; clicking expands media to 100% width (description collapses to 0%), same Framer Motion animate pattern as the Lectures studio cards

### Modify
- `addDesignPortfolio` in Motoko to accept and store `description` param
- `FacultyPortfolio.tsx` PortfolioCard to use the new split-card layout with expand toggle
- Research confirmation overlay to show background image texture

### Remove
- Nothing removed

## Implementation Plan
1. **Motoko**: Add `description : Text` to `DesignPortfolioItem` type; add `description` param to `addDesignPortfolio` function
2. **Admin**: Add description `FormField` to `AddDesignPortfolioModal`; pass it to `actor.addDesignPortfolio`
3. **Research page**: Add `<img>` background to confirmation overlay at opacity 0.15; add `<audio>` element with forest music file, autoplay, loop, volume 0.04; add mute/unmute button (bottom-right fixed)
4. **FacultyPortfolio**: Redesign `PortfolioCard` to flex-row split layout; add `isExpanded` state; animate left column width between 65%/100% and right column between 35%/0% with Framer Motion; add Maximize2/Minimize2 toggle button in media zone top-right; map `description` from backend item
