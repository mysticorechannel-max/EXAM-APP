# UI Figma Alignment Fixes - Bugfix Design

## Overview

Multiple UI components in the dashboard deviate from the Figma design specifications. The sidebar user card lacks proper avatar display and layout, the diplomas page grid uses incorrect gap values and lacks a scrollable container with a scroll indicator, and typography/spacing values are inconsistent with Figma specs. This fix brings each component into pixel-perfect alignment with the Figma designs while preserving all existing functionality (navigation, logout, dropdown menus, loading states, error states).

## Glossary

- **Bug_Condition (C)**: The condition where rendered UI elements do not match Figma design specifications in terms of spacing, sizing, typography, scroll behavior, or layout
- **Property (P)**: The rendered UI matches Figma pixel-for-pixel — correct grid gap (10px), scrollable diplomas container, proper user card layout with avatar/name/email, and correct typography (Geist Mono, size 14px, weight 400)
- **Preservation**: All interactive behaviors (dropdown menu, navigation, logout, tab switching, loading/error states, mobile sidebar) must remain unchanged
- **SidebarUserCard**: Component in `src/features/users/components/SidebarUserCard.tsx` rendering the user's profile photo, name, email, and three-dot menu at the bottom of the sidebar
- **DiplomasGrid**: Component in `src/features/diplomas/components/DiplomasGrid.tsx` rendering diploma cards in a responsive grid layout
- **DiplomasPage**: Route component in `src/features/diplomas/routes/DiplomasPage.tsx` composing the blue header banner, grid, and scroll indicator
- **DashboardLayout**: Shared layout in `src/shared/layouts/DashboardLayout.tsx` providing the sidebar, navigation, and main content area

## Bug Details

### Bug Condition

The bug manifests when dashboard pages are rendered and their visual output deviates from Figma specifications. The deviations include incorrect grid gaps, missing scrollable containers, missing scroll indicators with chevron icons, and typography mismatches.

**Formal Specification:**
```
FUNCTION isBugCondition(component)
  INPUT: component of type RenderedUIComponent
  OUTPUT: boolean

  RETURN (component.id == "DiplomasGrid" AND component.gap != "10px")
         OR (component.id == "DiplomasPage" AND NOT component.hasScrollableContainer)
         OR (component.id == "DiplomasPage" AND NOT component.hasScrollIndicatorWithChevron)
         OR (component.id == "DiplomasPage" AND component.titleFontSize != "14px")
         OR (component.id == "DiplomasPage" AND component.titleFontWeight != "400")
         OR (component.id == "SidebarUserCard" AND NOT component.avatarAlwaysVisible)
         OR (component.id == "SidebarUserCard" AND component.nameFont != "Geist Mono bold #155DFC")
END FUNCTION
```

### Examples

- **DiplomasGrid gap**: Current code uses `gap-6` (24px). Figma specifies `gap: 10px`. Expected: `gap-2.5` or custom `gap-[10px]`.
- **Diplomas scroll**: Current code renders all cards in normal page flow, causing full-page scroll. Expected: a fixed-height scrollable container wrapping the grid.
- **Scroll indicator**: Current code shows only text "Scroll to view more" without a chevron icon, and does not hide when scrolled to bottom. Expected: centered gray text + downward chevron, hidden at scroll end.
- **Diplomas title typography**: Current code uses `text-[18px] font-semibold`. Figma specifies font-size 14px, weight 400, Geist Mono.
- **SidebarUserCard avatar**: Current code shows a 40x40 `rounded-lg` avatar. Figma shows a square with rounded corners (~40-44px). The current implementation is mostly correct but must ensure avatar is always visible (fallback to initials).

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Three-dot menu dropdown must continue to open/close and navigate to Account, Dashboard, or Logout
- Sidebar navigation highlighting and routing must remain intact
- Account Settings tab switching (Profile, Change Password) must continue working
- Logout from any location must clear auth and redirect to login
- Diplomas loading skeleton and error state with "Try Again" button must remain
- Mobile sidebar hamburger toggle with overlay must remain functional

**Scope:**
All interactions that do NOT relate to visual spacing, sizing, typography, or scroll behavior should be completely unaffected. This includes:
- Click handlers on buttons and navigation links
- API calls and data fetching logic
- State management (menu open/close, tab selection)
- Routing and redirects
- Responsive breakpoint behavior (mobile vs desktop)

## Hypothesized Root Cause

Based on the bug description, the most likely issues are:

1. **Incorrect Tailwind gap class on DiplomasGrid**: The grid uses `gap-6` (24px) instead of `gap-[10px]` as specified in Figma (10px gap between cards).

2. **Missing scrollable container on DiplomasPage**: The page uses a simple `flex flex-col gap-6` without constraining the grid height or adding overflow-y-auto, so the entire page scrolls instead of just the diplomas area.

3. **Incomplete scroll indicator implementation**: The current indicator is a simple `<p>` tag with text only. Figma requires a chevron icon below the text, and the indicator must disappear when scrolled to the bottom (requires scroll event detection).

4. **Typography mismatch on Diplomas header**: The banner title uses `text-[18px] font-semibold` but Figma specifies 14px size with weight 400 (regular).

5. **SidebarUserCard is largely correct**: The avatar, name (blue, bold, Geist Mono), email (gray), and three-dot menu are already implemented. Minor adjustments may be needed to ensure the avatar is always rendered (the current fallback logic is present but may need verification).

## Correctness Properties

Property 1: Bug Condition - UI Components Match Figma Specifications

_For any_ rendered dashboard component where the bug condition holds (isBugCondition returns true), the fixed component SHALL render with the exact Figma-specified values: DiplomasGrid uses 10px gap, DiplomasPage wraps the grid in a scrollable container, the scroll indicator includes a downward chevron and hides at scroll bottom, the Diplomas header uses Geist Mono 14px weight 400, and SidebarUserCard always displays a visible avatar.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 2: Preservation - Interactive Behavior Unchanged

_For any_ user interaction that is NOT related to visual layout/styling (click handlers, navigation, logout, tab switching, API calls, loading/error states, mobile sidebar), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7**

## Fix Implementation

### Changes Required

**File**: `src/features/diplomas/components/DiplomasGrid.tsx`

**Specific Changes**:
1. **Fix grid gap**: Change `gap-6` to `gap-[10px]` in both the main grid and the skeleton loading grid to match Figma's 10px gap specification.

**File**: `src/features/diplomas/routes/DiplomasPage.tsx`

**Specific Changes**:
2. **Add scrollable container**: Wrap the DiplomasGrid in a container with fixed/constrained height and `overflow-y-auto` so the grid scrolls internally rather than the full page.
3. **Fix banner typography**: Change the "Diplomas" title from `text-[18px] font-semibold` to `text-[14px] font-normal` to match Figma spec (14px, weight 400).
4. **Add chevron to scroll indicator**: Add a `ChevronDown` icon from lucide-react below the "Scroll to view more" text, styled in gray and centered.
5. **Add scroll-to-bottom detection**: Use a scroll event listener (or IntersectionObserver) on the scrollable container to hide the scroll indicator when the user has scrolled to the bottom.

**File**: `src/features/users/components/SidebarUserCard.tsx`

**Specific Changes**:
6. **Ensure avatar always visible**: Verify the existing fallback logic (initials when no photo) is working correctly. The current implementation already handles this with a conditional render between `<img>` and initials `<div>`. No changes needed unless testing reveals issues.

**File**: `src/shared/layouts/DashboardLayout.tsx`

**Specific Changes**:
7. **Verify sidebar width**: Confirm `w-[250px]` matches Figma (already correct).
8. **Verify nav item styling**: Confirm active state uses `bg-blue-50 text-blue-600` (already correct). Ensure font is Geist Mono for nav labels if Figma requires it.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the visual deviations on unfixed code, then verify the fix matches Figma specs and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the UI deviations BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Write component render tests that assert specific CSS class names, DOM structure, and computed styles. Run these tests on the UNFIXED code to observe failures.

**Test Cases**:
1. **Grid Gap Test**: Render DiplomasGrid and assert the grid container has `gap-[10px]` class (will fail on unfixed code which has `gap-6`)
2. **Scrollable Container Test**: Render DiplomasPage and assert the grid wrapper has `overflow-y-auto` and a height constraint (will fail on unfixed code)
3. **Scroll Indicator Chevron Test**: Render DiplomasPage with `hasMore=true` and assert a ChevronDown icon exists below the text (will fail on unfixed code)
4. **Typography Test**: Render DiplomasPage and assert the h1 has `text-[14px]` and `font-normal` classes (will fail on unfixed code which has `text-[18px] font-semibold`)

**Expected Counterexamples**:
- DiplomasGrid renders with `gap-6` instead of `gap-[10px]`
- DiplomasPage has no scrollable wrapper element
- Scroll indicator renders text-only without a chevron icon
- Diplomas title uses incorrect font size and weight

### Fix Checking

**Goal**: Verify that for all components where the bug condition holds, the fixed code produces the Figma-specified visual output.

**Pseudocode:**
```
FOR ALL component WHERE isBugCondition(component) DO
  result := renderFixed(component)
  ASSERT matchesFigmaSpec(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all interactive behaviors unrelated to visual styling, the fixed code behaves identically to the original code.

**Pseudocode:**
```
FOR ALL interaction WHERE NOT isBugCondition(interaction) DO
  ASSERT originalBehavior(interaction) = fixedBehavior(interaction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many interaction combinations automatically
- It catches edge cases in routing, state transitions, and event handling
- It provides strong guarantees that interactive behavior is unchanged

**Test Plan**: Observe behavior on UNFIXED code for all click handlers, navigation, and state changes, then write tests capturing that behavior.

**Test Cases**:
1. **Dropdown Menu Preservation**: Verify clicking three-dot menu opens dropdown, clicking Account/Dashboard navigates, clicking Logout clears auth
2. **Navigation Preservation**: Verify NavLink active state and routing continues to work after styling changes
3. **Tab Switching Preservation**: Verify Account Settings tabs (Profile, Change Password) continue to render correct forms
4. **Loading/Error State Preservation**: Verify DiplomasGrid skeleton and error state render unchanged
5. **Mobile Sidebar Preservation**: Verify hamburger toggle opens/closes sidebar with overlay

### Unit Tests

- Test DiplomasGrid renders with correct `gap-[10px]` class
- Test DiplomasPage scrollable container has correct overflow and height styles
- Test scroll indicator shows text + chevron when `hasMore` is true
- Test scroll indicator hides when scrolled to bottom
- Test Diplomas banner title has correct typography classes
- Test SidebarUserCard renders avatar (photo or initials fallback)

### Property-Based Tests

- Generate random diploma arrays of varying lengths and verify grid always uses 10px gap
- Generate random scroll positions and verify indicator visibility toggles correctly at bottom
- Generate random user profiles (with/without photos) and verify avatar is always rendered

### Integration Tests

- Test full DiplomasPage renders with scrollable grid, correct gap, and functional scroll indicator
- Test DashboardLayout sidebar renders correctly with user card, navigation, and brand logo
- Test navigation between Diplomas and Account Settings pages preserves all layout and interaction
