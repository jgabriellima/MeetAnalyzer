# System Patterns: Meeting Analyzer

## System Architecture
Meeting Analyzer follows a modern web application architecture with:

1. **Frontend Layer:**
   - Next.js (App Router)
   - React components with TypeScript
   - Tailwind CSS for styling
   - Shadcn/UI component library

2. **Backend Services:**
   - Supabase for authentication, database, and storage
   - PostgreSQL database with row-level security
   - API routes for backend operations
   - Provider-based transcription services
   - Modal Labs for specialized processing tasks

3. **Data Flow:**
   ```
   User → Frontend → Supabase Auth → Protected API Routes → 
   Database/Storage → Transcription Providers → NLP Processing → Frontend Display
   ```

4. **Internationalization Layer:**
   - Translation files organized by locale
   - Language detection and switching
   - Locale-specific formatting for dates and numbers
   - RTL support for UI components

## Key Technical Decisions

### Next.js App Router
- Provides server-side rendering capabilities
- Enables API routes and server components
- Simplifies routing and navigation
- Supports internationalized routing

### Supabase Integration
- Handles authentication and user management
- Provides secure database with row-level security
- Offers storage buckets for media files
- Enables real-time updates if needed

### Provider/Adapter Pattern
- Abstract interfaces for service integration
- Pluggable transcription providers (AssemblyAI, Whisper, Google Speech-to-Text)
- Swappable NLP processing engines
- Interchangeable visualization strategies
- Extensible integration points for CRMs and calendar systems

### Speech Recognition Adapters
- Default adapter for AssemblyAI
- Alternative adapters for Whisper, Google Speech-to-Text
- Support for on-premise models
- Consistent API for transcription and diarization
- Provider-specific feature extensions

### Modal Labs Integration
- Handles specialized high-load processing tasks
- Offloads computation-intensive operations
- Provides scalable backend processing

### Visualization System
- Dynamic relationship mapping between topics
- NLP-based weight calculation for topic importance
- Interactive node-based visualization
- Cross-meeting topic analysis

### Third-Party Integrations
- CRM adapters (Salesforce, Hubspot) for pipeline insights
- Calendar integration (Google Calendar, Outlook) for meeting management
- Meeting platform connectors (Zoom, Meet, Teams) for automatic recording ingestion

### Internationalization Strategy
- Translation files for UI text
- Locale-aware component rendering
- RTL layout support
- Date and number formatting by locale
- Language selection persistence
- Dynamic loading of language resources

## Design Patterns

### Provider/Adapter Pattern
- Abstract provider interfaces
- Concrete provider implementations
- Feature detection and capability management
- Configuration-based provider selection

### Theme-based Organization
- Insight-first structure over meeting-centric view
- Cross-cutting topic tracking across meetings
- Timeline-based theme evolution visualization

### Authentication Pattern
- Email/password and OAuth providers
- Protected routes and API endpoints
- MFA support for enhanced security

### Data Access Pattern
- Row-level security policies to ensure users only access their data
- Service roles for backend operations
- Storage policies for secure file handling

### UI Component Pattern
- Reusable UI components using Shadcn/UI
- Consistent styling with Tailwind CSS
- Responsive design for all device sizes
- Internationalized components with translation support

### State Management
- Server and client components for efficient rendering
- Local state for UI interactions
- Database state for persistent storage
- Locale state for internationalization

### Internationalization Pattern
- Translation key approach with namespaces
- Component-level translations
- Server and client translation support
- Locale detection and preference storage
- Fallback language handling

## Component Relationships

### Core Components:
1. **Authentication Components**
   - Login/Signup forms
   - Authentication providers
   - Protected routes

2. **Meeting Management Components**
   - Automatic and manual upload interfaces
   - Meeting list/grid with insight highlighting
   - Meeting details view
   - Collection organization
   - Calendar integration

3. **Meeting Interface Components**
   - Tab navigation system
   - Overview tab with dynamic relationship visualization
   - Transcript tab with diarized transcript display
   - Comments tab with threaded comments
   - Assistant tab with chat interface
   - Pre-meeting context panel

4. **Playback Components**
   - Audio/video player with transcript synchronization
   - Playback controls
   - Timestamp navigation
   - Emotion/sentiment indicators

5. **Analysis Components**
   - Dynamic topic relationship visualizer
   - Meeting theme explorer
   - Speaker metrics visualization
   - Emotion and sentiment analysis
   - Team performance dashboard
   - CRM opportunity connector

6. **Marketing Components**
   - Landing page with value propositions
   - Authentication pages with benefits messaging
   - Testimonial displays
   - Feature highlights
   - Pricing component

7. **Internationalization Components**
   - Language selector
   - Locale-aware formatters
   - Translation providers
   - RTL layout components

### Data Model:
- Users
- Meetings
- Collections (groups of related meetings)
- Themes (cross-cutting topics across meetings)
- Transcriptions
- Speakers
- Comments
- Analysis results
- Integration connections (CRM, Calendar)
- Team performance metrics
- User preferences (including language settings)

## Implementation Progress:

### Completed Components:
- Landing page with core value propositions
- Authentication pages with marketing copy
- Relationship graph visualization concept
- 4-tab interface presentation
- Portuguese localization for key pages

### In Progress Components:
- Main application dashboard
- Meeting details view with 4-tab interface
- Relationship visualization implementation
- Provider interfaces and adapters
- Integration connectors 