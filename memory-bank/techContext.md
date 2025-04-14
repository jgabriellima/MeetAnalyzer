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
- **Internationalization**:
  - next-intl for translations and localization
  - React-intl for formatting dates, numbers, and plurals

### Backend
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Storage
  - Row Level Security
- **API Routes**: Next.js API routes for server-side logic
- **Edge Functions**: Vercel Edge Functions for lightweight processing
  - Real-time data transformations
  - Authentication flows
  - Simple data aggregation
  - Basic NLP tasks
  - Webhook handlers
  - Caching and rate limiting
- **ModalLabs Serverless**: Compute-intensive tasks
  - Complex transcription processing
  - Advanced NLP and ML tasks
  - Large file analysis
  - GPU-accelerated computations
  - Batch processing jobs
  - Custom model training
  - Organized in function-specific stubs
  - Proper dependency and resource management
  - Environment-specific deployments
  - Comprehensive logging and monitoring
- **Provider System**:
  - Abstract provider interfaces
  - Provider factory and registry
  - Configuration-based provider selection
  - Resource management and allocation
  - Error handling and retries
- **Speech Processing**: 
  - Provider-based transcription system
  - AssemblyAI (default adapter)
  - Whisper (alternative adapter)
  - Google Speech-to-Text (alternative adapter)
  - On-premise model support
  - GPU-accelerated processing
  - Batch processing capabilities
- **NLP Processing**:
  - Topic extraction and relationship analysis
  - Sentiment and emotion analysis
  - Action item detection
  - Contextual summarization
  - Scalable processing with Modal

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
- Localized interface (Portuguese primary, English secondary)
- Support for additional languages through translation files

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

# Localization
DEFAULT_LOCALE=pt-BR
SUPPORTED_LOCALES=pt-BR,en-US
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
  },
  "localization": {
    "defaultLocale": "pt-BR",
    "supportedLocales": ["pt-BR", "en-US"],
    "fallbackLocale": "en-US"
  }
}
```

### Local Development Commands
- `npm install` or `yarn`: Install dependencies
- `npm run dev` or `yarn dev`: Start development server
- `npm run build` or `yarn build`: Build for production
- `npm start` or `yarn start`: Start production server
- `npm run lint` or `yarn lint`: Run ESLint
- `npm run extract-messages` or `yarn extract-messages`: Extract translation strings

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
- Optimized loading of translation resources

### Localization Considerations
- Support for multiple languages (Portuguese and English initially)
- Right-to-left (RTL) language support in UI design
- Date, time, and number formatting based on locale
- Translation file management and updates
- Dynamic loading of language resources
- Handling of language-specific content (like transcriptions)
- Maintaining consistent terminology across languages

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
- next-intl for internationalization
- react-intl for formatting dates, numbers, and plurals

## Backend Processing Architecture

### Modal Labs Integration
Our processing infrastructure is built on Modal Labs, providing:
- GPU-accelerated audio processing
- Scalable NLP analysis
- Batch processing capabilities

Key components:
1. **Processing Functions**
   - Deployed as HTTP endpoints
   - Accessible via REST API
   - No runtime dependency on Modal SDK

2. **Resource Configuration**
   ```python
   # Audio Processing
   @stub.function(
       gpu="A10G",
       memory=16384,
       timeout=3600
   )
   @modal.fastapi_endpoint()
   def process_audio()
   
   # NLP Processing
   @stub.function(
       cpu=4,
       memory=8192,
       timeout=1800
   )
   @modal.fastapi_endpoint()
   def process_text()
   ```

3. **Integration Layer**
   ```typescript
   // Edge Function Integration
   import { ModalProvider } from '@/providers/modal';
   
   export class ProcessingService {
       private modal: ModalProvider;
       
       constructor() {
           this.modal = new ModalProvider({
               processAudio: process.env.MODAL_PROCESS_AUDIO_URL,
               processText: process.env.MODAL_PROCESS_TEXT_URL
           });
       }
       
       async processMeeting(audioUrl: string) {
           return this.modal.processAudio(audioUrl);
       }
   }
   ```

### Development Workflow
1. **Local Development**
   ```bash
   modal serve ./src/modal_functions/api.py
   ```

2. **Deployment**
   ```bash
   modal deploy ./src/modal_functions/api.py
   ```

3. **Environment Setup**
   ```bash
   # .env.production
   MODAL_PROCESS_AUDIO_URL=https://org--meeting-analyzer-process-audio.modal.run
   MODAL_PROCESS_TEXT_URL=https://org--meeting-analyzer-process-text.modal.run
   MODAL_API_TOKEN=your_token_here
   ```

### Security & Access Control
1. **Authentication**
   - Token-based auth for Modal endpoints
   - Environment-based secrets management
   - Secure token rotation

2. **Data Flow**
   - Secure file upload to Supabase
   - URL-based file access
   - Encrypted data transmission

### Monitoring & Observability
1. **Health Checks**
   ```python
   @stub.function()
   @modal.fastapi_endpoint()
   def health():
       return {
           "status": "healthy",
           "version": "1.0.0"
       }
   ```

2. **Metrics**
   - Processing latency
   - Error rates
   - Resource utilization 