# Technical Context: Meeting Analyzer

## Technologies Used

### Frontend
- **Next.js**: App Router (v15.1.3)
- **React**: v19.0.0
- **TypeScript**: v5+
- **UI Libraries**:
  - Tailwind CSS (v3.4.1)
  - Shadcn/UI (via Radix UI components)
  - Lucide React (for icons)
  - Recharts (for data visualization)
  - D3.js/Force-directed graphs for relationship visualization
- **Media Playback**:
  - React Player or similar for video/audio playback
- **Assistant UI**:
  - Custom chat interface components
- **Analytics**: Vercel Analytics

### Backend
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Storage
  - Row Level Security
- **API Routes**: Next.js API routes for server-side logic
- **Provider System**:
  - Abstract provider interfaces
  - Provider factory and registry
  - Configuration-based provider selection
- **Speech Processing**: 
  - Provider-based transcription system
  - AssemblyAI (default adapter)
  - Whisper (alternative adapter)
  - Google Speech-to-Text (alternative adapter)
  - On-premise model support
- **NLP Processing**:
  - Topic extraction and relationship analysis
  - Sentiment and emotion analysis
  - Action item detection
  - Contextual summarization
- **Modal Labs**: For specialized high-load processing tasks

### Third-Party Integrations
- **CRM Integrations**:
  - Salesforce connector
  - Hubspot connector
  - Custom CRM adapter interface
- **Calendar Integrations**:
  - Google Calendar connector
  - Microsoft Outlook connector
  - Calendar abstraction layer
- **Meeting Platforms**:
  - Zoom integration
  - Google Meet integration
  - Microsoft Teams integration
  - Automatic recording ingestion

### Multi-lingual Support
- Language detection
- Automated translation
- Cross-language topic matching
- Language-specific NLP processing

## Development Setup

### Environment Requirements
- Node.js (LTS version)
- NPM or Yarn package manager
- Supabase account
- Access to speech recognition services (AssemblyAI, Whisper API, etc.)
- (Optional) Modal Labs account
- (Optional) CRM developer accounts
- (Optional) Calendar API access

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://APIURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANONKEY
SUPABASE_SERVICE_ROLE_KEY=SERVICEROLEKEY

# Transcription Providers
ASSEMBLYAI_API_KEY=ASSEMBLYAPIKEY
OPENAI_API_KEY=OPENAI_KEY_FOR_WHISPER
GOOGLE_SPEECH_API_KEY=GOOGLESPEECHKEY

# Integration Keys (Optional)
SALESFORCE_CLIENT_ID=SFCLIENTID
SALESFORCE_CLIENT_SECRET=SFCLIENTSECRET
HUBSPOT_API_KEY=HUBSPOTKEY
GOOGLE_CALENDAR_CLIENT_ID=GCALCLIENTID
GOOGLE_CALENDAR_CLIENT_SECRET=GCALCLIENTSECRET
MICROSOFT_GRAPH_CLIENT_ID=MSGRAPHCLIENTID
MICROSOFT_GRAPH_CLIENT_SECRET=MSGRAPHCLIENTSECRET

# Default Provider Config
DEFAULT_TRANSCRIPTION_PROVIDER=assemblyai
```

### Provider Configuration
Configuration for selecting and initializing providers:
```json
{
  "transcription": {
    "default": "assemblyai",
    "providers": {
      "assemblyai": {
        "enabled": true,
        "features": ["diarization", "sentiment", "topics", "entities"]
      },
      "whisper": {
        "enabled": true,
        "features": ["transcription", "translation"]
      },
      "google": {
        "enabled": false,
        "features": ["diarization", "transcription"]
      },
      "onpremise": {
        "enabled": false,
        "endpoint": "http://localhost:5000/transcribe",
        "features": ["transcription"]
      }
    }
  },
  "integrations": {
    "crm": {
      "enabled": true,
      "default": "salesforce"
    },
    "calendar": {
      "enabled": true,
      "default": "google"
    },
    "meetingPlatforms": {
      "enabled": true,
      "autoIngest": true
    }
  }
}
```

### Local Development Commands
- `npm install` or `yarn`: Install dependencies
- `npm run dev` or `yarn dev`: Start development server
- `npm run build` or `yarn build`: Build for production
- `npm start` or `yarn start`: Start production server
- `npm run lint` or `yarn lint`: Run ESLint

### Supabase Setup
- Create Supabase project
- Configure authentication settings
- Set up database tables and RLS policies
- Configure storage buckets and policies

### Deployment
Primary deployment platform: Vercel
1. Connect GitHub repository
2. Configure environment variables
3. Deploy

## Technical Constraints

### API Limitations
- Supabase free tier limits on database and storage
- Transcription service API rate limits and processing times
- CRM and Calendar API usage restrictions
- File upload size limitations

### Security Requirements
- Row Level Security implementation
- Secure handling of meeting recordings
- Authentication of all API routes
- Proper storage access policies
- OAuth token management for third-party services
- Data isolation between integrations

### Performance Considerations
- Optimization of media file handling
- Efficient transcription processing
- Provider fallback mechanisms
- Responsive UI across devices
- API call optimizations
- Caching strategies for processed transcripts
- Background processing for relationship analysis

## Dependencies
Key dependencies include:
- @supabase/supabase-js and @supabase/ssr for Supabase integration
- d3/force for dynamic relationship visualization
- Provider-specific SDK packages (assemblyai, openai, etc.)
- Integration libraries for CRMs and calendars
- React context providers for integration state management
- Natural language processing libraries for topic analysis
- UI components from @radix-ui
- Tailwind utilities and plugins 