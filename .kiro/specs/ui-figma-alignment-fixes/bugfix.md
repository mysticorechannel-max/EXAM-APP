# Bugfix Requirements Document

## Introduction

Multiple UI components in the dashboard do not match the Figma design specifications. The issues span the sidebar layout, the sidebar user profile card, the Account Settings page, and the Diplomas page. These visual regressions cause inconsistency between the implemented UI and the intended design, impacting overall product polish and user experience.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the sidebar is rendered THEN the system displays the user profile card without a visible avatar image (only initials fallback or incorrectly sized photo), and the full name and email are not displayed as designed in the Figma

1.2 WHEN the sidebar is rendered THEN the system uses incorrect spacing, sizing, alignment, icon dimensions, and padding that do not match the Figma sidebar design

1.3 WHEN the Account Settings page is rendered THEN the system displays spacing, typography, border radius, colors, and alignment values that do not match the Figma design pixel-for-pixel

1.4 WHEN the Diplomas page is rendered with multiple diplomas THEN the system renders all diploma cards at once in the page flow without a scrollable container, causing the entire page to scroll instead of only the diplomas grid

1.5 WHEN the Diplomas page is rendered THEN the system either does not display the "Scroll to view more" indicator with its down-arrow icon, or it does not function as an interactive scroll hint as shown in the Figma

### Expected Behavior (Correct)

2.1 WHEN the sidebar is rendered THEN the system SHALL display the user's avatar (circular profile photo or initials fallback), full name (first + last), email address, and a three-dot menu button, matching the Figma layout exactly

2.2 WHEN the sidebar is rendered THEN the system SHALL use spacing, sizing, alignment, icon sizes, and padding values that match the Figma sidebar design exactly (including logo area, nav items gap, and user card placement)

2.3 WHEN the Account Settings page is rendered THEN the system SHALL match the Figma design for all spacing, typography (font sizes, weights, line heights), border radius, colors, and alignment across the header banner, sub-navigation tabs, and form content area

2.4 WHEN the Diplomas page is rendered with multiple diplomas THEN the system SHALL display the diploma cards inside a scrollable container with a fixed height, allowing internal scroll within the diplomas area rather than scrolling the entire page

2.5 WHEN the Diplomas page is rendered THEN the system SHALL display a "Scroll to view more" text indicator with a downward arrow that is visible when more content exists below the visible area, and the indicator SHALL disappear or update when the user has scrolled to the bottom

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user clicks the three-dot menu in the sidebar user card THEN the system SHALL CONTINUE TO show the dropdown with Account, Dashboard, and Logout options functioning correctly

3.2 WHEN the user navigates between sidebar nav items (Diplomas, Account Settings) THEN the system SHALL CONTINUE TO highlight the active nav item and route to the correct page

3.3 WHEN the user switches tabs on the Account Settings page (Profile, Change Password) THEN the system SHALL CONTINUE TO display the corresponding form content correctly

3.4 WHEN the user clicks Logout from any location (sidebar menu or Account Settings page) THEN the system SHALL CONTINUE TO clear auth data and redirect to the login page

3.5 WHEN the Diplomas page is loading THEN the system SHALL CONTINUE TO display skeleton loading cards in the grid layout

3.6 WHEN the Diplomas API returns an error THEN the system SHALL CONTINUE TO display the error state with a "Try Again" button

3.7 WHEN the sidebar is viewed on mobile THEN the system SHALL CONTINUE TO show/hide via the hamburger menu with the overlay backdrop
