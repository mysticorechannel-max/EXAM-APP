# Implementation Plan

- [x] 1. Fix DiplomasGrid gap spacing
  - In `src/features/diplomas/components/DiplomasGrid.tsx`:
  - Change `gap-6` to `gap-[10px]` in the main grid container (line with diplomas.map)
  - Change `gap-6` to `gap-[10px]` in the skeleton loading grid container
  - _Bug_Condition: DiplomasGrid.gap != "10px"_
  - _Expected_Behavior: Grid uses 10px gap between cards matching Figma spec_
  - _Preservation: Error state, empty state, loading skeleton structure unchanged_
  - _Requirements: 2.4_

- [x] 2. Add scrollable container to DiplomasPage
  - In `src/features/diplomas/routes/DiplomasPage.tsx`:
  - Wrap `<DiplomasGrid>` in a `<div>` with constrained height (`max-h-[calc(100vh-220px)]` or similar) and `overflow-y-auto`
  - Add `ref` to the scrollable container for scroll detection
  - _Bug_Condition: DiplomasPage does not have scrollable container_
  - _Expected_Behavior: Diplomas grid scrolls internally rather than full page scroll_
  - _Preservation: Loading, error states, and grid rendering unchanged_
  - _Requirements: 2.4_

- [x] 3. Fix DiplomasPage banner typography
  - In `src/features/diplomas/routes/DiplomasPage.tsx`:
  - Change `text-[18px] font-semibold` to `text-[14px] font-normal` on the h1 element
  - Remove the `xl:text-[20px]` responsive override
  - _Bug_Condition: DiplomasPage.titleFontSize != "14px" OR titleFontWeight != "400"_
  - _Expected_Behavior: Banner title renders at 14px, weight 400, Geist Mono_
  - _Preservation: Banner color, icon, padding, and border-radius unchanged_
  - _Requirements: 2.5_

- [x] 4. Add ChevronDown icon to scroll indicator and scroll detection
  - In `src/features/diplomas/routes/DiplomasPage.tsx`:
  - Import `ChevronDown` from `lucide-react`
  - Replace the plain `<p>` scroll indicator with a flex-col container showing text + ChevronDown icon
  - Add `useState` for `isScrolledToBottom` (default false)
  - Add `onScroll` handler on scrollable container to detect when scrolled to bottom
  - Hide the scroll indicator when `isScrolledToBottom` is true
  - Style: text-sm text-gray-500 centered, ChevronDown h-4 w-4 text-gray-400
  - _Bug_Condition: DiplomasPage does not have scroll indicator with chevron OR does not hide at bottom_
  - _Expected_Behavior: Scroll indicator with chevron visible when more content; hidden at scroll bottom_
  - _Preservation: hasMore logic unchanged_
  - _Requirements: 2.5_

- [x] 5. Fix SidebarUserCard to show full name
  - In `src/features/users/components/SidebarUserCard.tsx`:
  - Change the name display from `{user.firstName}` to `{user.firstName} {user.lastName}`
  - Verify avatar fallback (initials) renders correctly for users without profilePhoto
  - _Bug_Condition: SidebarUserCard does not show full name_
  - _Expected_Behavior: Full name (first + last) displayed in blue bold Geist Mono_
  - _Preservation: Dropdown menu, logout, navigation all unchanged_
  - _Requirements: 2.1_

- [x] 6. Verify DashboardLayout sidebar alignment
  - In `src/shared/layouts/DashboardLayout.tsx`:
  - Confirm sidebar width is `w-[250px]` (already correct)
  - Confirm nav items use proper font (add `font-[Geist_Mono]` to NavLink className if missing)
  - Confirm spacing between logo area and nav (`px-5 py-6` for logo, `space-y-1 px-3 pt-2` for nav)
  - _Preservation: Mobile sidebar toggle, overlay, routing all unchanged_
  - _Requirements: 2.2_

- [ ] 7. Fix Account Settings page layout to fit viewport
  - In `src/features/users/routes/AccountSettingsPage.tsx`:
  - Make the page use `h-full` and `overflow-hidden` so it fits the viewport without scrolling
  - Reduce gap between header and content area
  - Make the right content panel use internal scroll if needed (`overflow-y-auto` with flex-1)
  - Ensure the left sub-nav and right form are properly constrained in height
  - _Requirements: 2.3_

- [ ] 8. Checkpoint - Manual visual verification
  - Run the app locally and verify all changes match Figma
  - Verify DiplomasGrid gap is visually 10px
  - Verify diplomas area scrolls internally with scroll indicator + chevron
  - Verify scroll indicator disappears at bottom
  - Verify banner title is smaller (14px, normal weight)
  - Verify sidebar user card shows avatar + full name + email
  - Verify all interactive behaviors still work (navigation, dropdown menu, logout, tabs)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
