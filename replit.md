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
- Sortable, filterable data tables for equipment listing
- Side panel for detailed equipment inspection
- Responsive sidebar navigation with collapsible mobile view

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
- Currently using in-memory storage (`MemStorage` class) with sample seed data
- Interface-based storage abstraction (`IStorage`) allows easy migration to persistent database
- Drizzle ORM configured for PostgreSQL with schema defined and ready for migration
- Schema includes comprehensive equipment fields: location data (lat/lng), technical specs (manufacturer, model, capacity, voltage), maintenance tracking

### Data Model

**Equipment Schema:**
- Core identifiers: UUID primary key, unique equipment ID (e.g., "TRF-001-NYC")
- Categorization: type (Transformer, Substation, Generator, etc.), status (operational, maintenance, offline)
- Location data: human-readable address, decimal latitude/longitude for mapping
- Technical specifications: manufacturer, model, capacity, voltage
- Temporal data: installation date, last maintenance date
- All fields except optional technical specs are required

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
- No authentication system currently implemented
- Session management dependencies present (connect-pg-simple) but not active