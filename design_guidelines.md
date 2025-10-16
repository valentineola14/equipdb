# Electric Grid Equipment Database - Design Guidelines

## Design Approach: Enterprise Data Application

**Selected Framework:** Carbon Design System principles - optimized for data-heavy enterprise applications requiring efficient information display and complex search capabilities.

**Core Principles:**
- Data clarity and scanability over visual flair
- Efficient search and filtering workflows
- Clean, professional industrial aesthetic
- Minimal cognitive load for frequent users

---

## Color Palette

**Dark Mode (Primary):**
- Background Base: 220 15% 12%
- Surface: 220 15% 16%
- Surface Elevated: 220 15% 20%
- Primary Brand: 210 100% 45% (Electric Blue - represents power/energy)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%
- Border: 220 15% 25%
- Success: 142 71% 45% (operational equipment)
- Warning: 38 92% 50% (maintenance alerts)
- Error: 0 84% 60% (critical issues)

**Light Mode:**
- Background: 220 15% 98%
- Surface: 0 0% 100%
- Primary: 210 100% 40%
- Text Primary: 220 15% 15%

---

## Typography

**Font Stack:** 'Inter', system-ui, sans-serif (via Google Fonts)

**Hierarchy:**
- Page Headers: 24px/600
- Section Titles: 18px/600
- Data Labels: 14px/500
- Body/Table Content: 14px/400
- Captions/Metadata: 12px/400
- Monospace for IDs: 'JetBrains Mono' 13px/400

---

## Layout System

**Spacing Primitives:** Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16
- Tight spacing (1-2): Within components
- Standard (4-6): Between related elements
- Generous (8-12): Between sections
- Maximum (16): Page margins

**Grid System:**
- Main container: max-w-7xl with px-4 md:px-6
- Sidebar navigation: 240px fixed width
- Content area: Fluid with min-width constraints
- Map/Data split: 60/40 or 50/50 responsive

---

## Core Components

### Navigation & Search
**Top Bar (Fixed):**
- Logo/App name left
- Global search bar center (min-w-96) with autocomplete dropdown
- Filter toggle, settings, user menu right
- Height: h-14, border-b, bg-surface

**Sidebar Navigation:**
- Collapsible list view
- Active state: bg-primary/10 with left accent border
- Icons from Heroicons (outline style)
- Sections: Dashboard, Equipment List, Map View, Analytics, Settings

### Search & Filter Panel
**Advanced Search Bar:**
- Multi-field search supporting: Equipment ID, Location/Address, Lat/Long coordinates
- Search type tabs above input
- Quick filters as chips below
- Real-time suggestions dropdown

**Filter Panel (Collapsible):**
- Equipment type checkboxes
- Status radio buttons (Operational, Maintenance, Offline)
- Date range picker for installation/maintenance
- Location radius slider for geo-search
- Apply/Reset actions

### Data Display

**Equipment Table:**
- Fixed header on scroll
- Columns: ID (monospace), Name, Type, Status (badge), Location, Coordinates, Last Maintenance
- Row hover: bg-surface-elevated
- Sortable columns with arrow indicators
- Row actions: View Details, Edit, Delete (icon buttons)
- Pagination: 25/50/100 per page options

**Equipment Cards (Alternative View):**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Card structure: ID header, status badge, location with pin icon, key specs, action button
- Compact design: p-4, rounded-lg, border

**Detail Panel (Slide-over):**
- Width: w-96 lg:w-[480px]
- Sections: Overview, Technical Specs, Location Map, Maintenance History
- Tabbed navigation for data organization

### Map Integration

**Interactive Map Component:**
- Full-height in map view (h-[calc(100vh-3.5rem)])
- Split view with data table: 60% map, 40% list
- Equipment markers: Color-coded by status
- Cluster markers for dense areas
- Click marker → detail popup
- Search by drawing area/radius
- Layer toggles: Grid lines, Substations, Transmission lines

**Map Controls:**
- Zoom controls top-right
- Layer switcher bottom-left
- Search radius tool
- Current location button (if permissions granted)

### Status & Alerts

**Status Badges:**
- Operational: bg-success/20 text-success
- Maintenance: bg-warning/20 text-warning
- Offline: bg-error/20 text-error
- Small pill shape: px-2 py-0.5 rounded-full text-xs

**Alert Banner:**
- Critical system alerts at page top
- Dismissible with icon-only close button
- Error state: bg-error/10 border-l-4 border-error

---

## Interactions

**Minimal Animation:**
- Sidebar collapse/expand: 200ms ease
- Panel slide transitions: 300ms ease-out
- Hover states: No transitions, instant feedback
- Loading states: Skeleton screens for data tables

**Loading States:**
- Table: Pulse skeleton rows
- Map: Spinner overlay with semi-transparent backdrop
- Search: Inline spinner in input field

---

## Images

**No Hero Images Required** - This is a data-focused utility application.

**Icon Assets:**
- Use Heroicons (outline) via CDN for all UI icons
- Equipment type icons: Battery, transformer, generator (24x24)
- Map markers: Custom SVG pins with status colors

**Map Tiles:**
- Use Mapbox GL JS or Leaflet with OpenStreetMap tiles
- Dark mode map style to match application theme

---

## Accessibility

- All interactive elements meet 4.5:1 contrast ratio
- Keyboard navigation: Tab through filters, tables, map controls
- ARIA labels for icon-only buttons
- Focus indicators: ring-2 ring-primary ring-offset-2
- Screen reader announcements for search results count

---

**Key Differentiator:** This application prioritizes data density and search efficiency over visual decoration. The interface should feel like a professional industrial tool - clean, fast, and purposeful with every pixel serving the core mission of locating equipment quickly.