# Electric Grid Equipment Database

## Overview

This is an enterprise-grade electric grid equipment tracking application designed for managing and monitoring power infrastructure assets such as transformers, substations, generators, and circuit breakers. The application provides comprehensive search capabilities (by ID, location, and GPS coordinates), interactive map visualization using Leaflet, and real-time equipment status monitoring. Built with a modern full-stack architecture, it emphasizes data clarity, efficient workflows, and a clean industrial aesthetic following Carbon Design System principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (5 main routes: Dashboard, Equipment List, Map View, Analytics, Settings)

**UI Component System:**
- Shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theme system supporting light/dark modes with local storage persistence
- Design follows Carbon Design System principles optimized for data-heavy enterprise applications

**State Management:**
- TanStack Query (React Query) for server state management with built-in caching
- Local React state for UI-specific concerns (filters, search parameters, panel visibility)
- No global state management library; relies on React Query's cache and React context

**Key Features:**
- Advanced search with multiple strategies: all fields, equipment ID, address, GPS coordinates with radius
- Interactive map using React Leaflet with custom status-based markers
- Sortable, filterable data tables with date range filtering (installation date, last maintenance)
- Type-specific equipment fields (different fields for Transformer, Substation, Generator, Circuit Breaker)
- Side panel for detailed equipment inspection
- Responsive sidebar navigation with collapsible mobile view
- Authenticated Settings page for CRUD operations (username: bahamas, password: equipment@2025)
- CSV/Excel bulk import with validation and error reporting

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and RESTful API endpoints
- Custom Vite middleware integration for seamless development experience
- Request logging with timing metrics for API calls

**API Design:**
- RESTful endpoints following conventional patterns:
  - `GET /api/equipment` - List all equipment
  - `GET /api/equipment/:id` - Get single equipment by internal ID
  - `GET /api/equipment/search` - Search with query parameters (supports text search and coordinate-based radius search)
- JSON request/response format with Zod schema validation
- Error handling middleware with standardized error responses

**Data Storage Strategy:**
- PostgreSQL database (Neon serverless) for persistent data storage
- Drizzle ORM for type-safe database operations
- Database schema includes:
  - Core equipment fields: UUID ID, equipment ID, name, type, status
  - Location data: address, latitude (decimal), longitude (decimal)
  - Technical specs: manufacturer, model, capacity, voltage
  - Temporal data: installation date, last maintenance (timestamps)
  - Type-specific data: JSONB column for equipment-type-specific fields

### Data Model

**Equipment Schema:**
- Core identifiers: UUID primary key, unique equipment ID (e.g., "TRF-001-NYC")
- Categorization: type (Transformer, Substation, Generator, Circuit Breaker, Capacitor Bank, Voltage Regulator), status (operational, maintenance, offline)
- Location data: human-readable address, decimal latitude/longitude for mapping
- Technical specifications: manufacturer, model, capacity, voltage
- Temporal data: installation date, last maintenance date
- Type-specific fields stored in JSONB:
  - Transformer: power rating, cooling type, tap changer type, insulation type
  - Substation: voltage level, number of bays, GIS/AIS type, control system
  - Generator: fuel type, rated power, efficiency, start type, coolant type
  - Circuit Breaker: breaking capacity, interrupting medium, number of poles, operating mechanism
  - Other types: capacity bank (rated kVAR, voltage rating), voltage regulator (regulation range, control mode)

### External Dependencies

**Database:**
- Neon serverless PostgreSQL configured via `@neondatabase/serverless`
- Connection managed through `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations with PostgreSQL dialect
- Currently using in-memory storage; database integration prepared but not active

**Third-Party Services:**
- Leaflet for map rendering (version 1.9.4)
- OpenStreetMap tiles as the default base map layer
- Google Fonts for typography (Inter for UI text, JetBrains Mono for monospace IDs)

**UI Libraries:**
- Radix UI primitives for 25+ accessible component patterns (dialogs, dropdowns, tabs, etc.)
- React Hook Form with Zod resolvers for form validation
- date-fns for date formatting and manipulation
- Lucide React for icon system
- class-variance-authority and clsx for conditional CSS class management

**Development Tools:**
- TypeScript for type safety across client and server
- ESBuild for production server bundling
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for development banner, error overlay, and cartographer

**Authentication:**
- Client-side authentication for Settings page
- Hardcoded credentials for internal use: username "bahamas", password "equipment@2025"
- Auth context provider manages authentication state
- Protected routes redirect to login when not authenticated

## Deployment Options

### Vercel Deployment (Serverless)

The application has been restructured for Vercel serverless deployment:

**Architecture Changes:**
- Serverless Express API in `/api/index.ts` - All backend routes converted to serverless functions
- Traditional server in `/server/index.ts` - Used for local development
- Database: Neon HTTP driver (already serverless-compatible)
- Frontend: Static build via Vite

**Key Files:**
- `vercel.json` - Vercel routing configuration (API routes + SPA fallback)
- `/api/index.ts` - Serverless Express handler with all API endpoints
- `.vercelignore` - Files excluded from deployment
- `README-VERCEL.md` - Complete deployment guide

**Validation & Security:**
- Search endpoint validates query parameters using `searchEquipmentSchema`
- CORS headers configured for cross-origin requests
- All dynamic field validation logic preserved
- Date handling for equipment creation/updates maintained
- Partial update merging for typeSpecificData intact

**Environment Variables Required:**
- `DATABASE_URL` - Neon PostgreSQL connection string

**Build Command:** `npm run vercel-build` (must be added to package.json)
**Output Directory:** `dist`

### Replit Publishing (Traditional Server)

The application can also be deployed directly on Replit:
- Uses `/server/index.ts` with traditional Express server
- No restructuring required
- Automatic HTTPS and custom domains
- Integrated database management

See `README-VERCEL.md` for detailed Vercel deployment instructions.