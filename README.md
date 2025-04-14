# Meeting Analyzer

A sophisticated web application designed to record, transcribe, and analyze business conversations, with a primary focus on the Brazilian market.

## Features

- Automatic meeting recording ingestion
- Provider-based transcription system (AssemblyAI, Whisper, Google Speech-to-Text)
- Dynamic topic relationship mapping
- Theme-based organization across meetings
- Pre-meeting contextual preparation
- CRM and calendar integration
- Emotional analysis and communication coaching
- AI assistant for meeting intelligence
- Localized interface in Portuguese

## Setup

### Prerequisites

- Node.js (LTS version)
- NPM or Yarn
- Supabase CLI
- ngrok (for local webhook testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meeting-analyzer.git
cd meeting-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
ASSEMBLYAI_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Start Supabase locally:
```bash
supabase start
```

6. Run database migrations:
```bash
chmod +x scripts/migrate.sh
./scripts/migrate.sh
```

7. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Webhook Setup

For local development with AssemblyAI webhooks:

1. Start ngrok:
```bash
chmod +x scripts/webhook.sh
./scripts/webhook.sh
```

2. Copy the ngrok URL and update your environment:
```
NEXT_PUBLIC_APP_URL=https://your-ngrok-url
```

## Architecture

### Transcription System

The transcription system uses a provider/adapter pattern to support multiple transcription services:

1. **Provider Interface:**
   - Defines standard methods for transcription services
   - Handles initialization, transcription, status checks, and webhooks
   - Manages service-specific features and configurations

2. **Default Provider (AssemblyAI):**
   - Automatic language detection
   - Speaker diarization
   - Entity detection
   - Topic extraction
   - Sentiment analysis
   - Chapter detection
   - Auto highlights

3. **Data Storage:**
   - Transcription segments with speaker information
   - Metadata (entities, topics, sentiment, etc.)
   - Speaker profiles and statistics

4. **Processing Flow:**
   - File upload to Supabase Storage
   - Transcription request to provider
   - Webhook notification on completion
   - Results processing and storage
   - Real-time status updates

## Development

### Adding a New Provider

1. Create a new provider class implementing `TranscriptionProvider`:
```typescript
export class NewProvider implements TranscriptionProvider {
    name = 'provider_name';
    features = {
        // Define supported features
    };

    async initialize(config: TranscriptionConfig): Promise<void> {
        // Initialize provider
    }

    async transcribe(meetingId: string, audioUrl: string, config?: TranscriptionConfig): Promise<void> {
        // Start transcription
    }

    async getStatus(meetingId: string): Promise<TranscriptionStatus> {
        // Check transcription status
    }

    async handleWebhook(payload: any): Promise<void> {
        // Process webhook
    }
}
```

2. Register the provider:
```typescript
const newProvider = new NewProvider();
transcriptionService.registerProvider(newProvider);
```

### Database Migrations

To create a new migration:

```bash
supabase db diff --file new_migration_name
```

To apply migrations:

```bash
./scripts/migrate.sh
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Features

- **Authentication**
    - Email/Password authentication
    - Multi-factor authentication (MFA) support
    - OAuth/SSO integration ready
    - Password reset and email verification

- **User Management**
    - User profiles and settings
    - Secure password management
    - Session handling

- **Meeting Management**
    - Upload and store meeting recordings
    - Transcription processing
    - Searchable meeting history
    - Sharing capabilities

- **Analysis Dashboard**
    - Speaker participation metrics
    - Topic tracking
    - Sentiment analysis
    - Action item extraction

- **Security**
    - Row Level Security (RLS) policies
    - Secure file storage policies
    - Protected API routes

## 🛠️ Tech Stack

*   **Frontend**
    - [Next.js](https://nextjs.org/) (App Router)
    - [React](https://reactjs.org/)
    - [TypeScript](https://www.typescriptlang.org/)
    - [Tailwind CSS](https://tailwindcss.com/)
    - [Shadcn/ui](https://ui.shadcn.com/) (UI Components)
    - [Lucide React](https://lucide.dev/) (Icons)

*   **Backend**
    - [Supabase](https://supabase.com/)
    - PostgreSQL
    - Row Level Security
    - Storage Buckets

*   **Authentication**
    - Supabase Auth
    - MFA support
    - OAuth providers

*   **AI Services**
    - [Groq](https://groq.com/) - AI processing

## External Services Setup

This project relies on several external services. Ensure you have configured the following:

1.  **Environment Variables:** Create a `.env.local` file in the root directory and add the necessary API keys:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://APIURL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ANONKEY
    SUPABASE_SERVICE_ROLE_KEY=SERVICEROLEKEY
    GROQ_API_KEY=GROQAPIKEY
    ```

2.  **Modal Labs (Optional - for specific processing tasks):** If you need to run or develop functions using [Modal Labs](https://modal.com/), you need to authenticate the Modal CLI locally. Run the following command in your terminal and paste your token ID and secret when prompted:
    ```bash
    modal token set --token-id ak-ma0lG7ouzQSpDfB1yylsQr --token-secret as-d8eEYRg1R1B3RJXK7HjPng
    ```

## 📦 Getting Started

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd meeting-analyzer
    ```

2.  **Set up Node.js:** Ensure you are using the LTS version (e.g., using nvm):
    ```bash
    nvm use --lts
    ```

3.  **Prepare Supabase Project:**
    - Create a Supabase project at [supabase.com](https://supabase.com)
    - Get your Project URL from `Project Settings` > `API` > `Project URL`
    - Get your Anon Key and Service Key from `Project Settings` > `API` > `anon public` and `service_role`

4.  **Setup Supabase locally:**
    ```bash
    # Login to supabase
    npx supabase login
    
    # Link project to supabase (requires database password)
    npx supabase link
    
    # Push configuration to the server
    npx supabase config push
    
    # Run migrations
    npx supabase migrations up --linked
    ```

5.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn
    ```

6.  **Copy environment variables:**
    ```bash
    cp .env.example .env.local
    ```
    And update with your Supabase and Groq credentials.

7.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

8.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment to Vercel

1. Fork or clone repository
2. Create project in Vercel - choose your repo
3. Add environment variables from your `.env.local`
4. Click deploy
5. Adjust your Supabase authentication settings to include your Vercel URL

## Development Roadmap (High-Level)

*   [x] Basic UI Structure (Header, Layout, Placeholders)
*   [ ] Implement Video/Audio Playback
*   [ ] Integrate Real Transcription Service (or use dummy data)
*   [ ] Implement Transcript Search
*   [ ] Connect Analysis Section to Data
*   [ ] Implement Authentication
*   [ ] Develop AI Insight Features (Summarization, Action Items, etc.)

## 🎨 Theming

The template includes several pre-built themes:
- `theme-sass` (Default)
- `theme-blue`
- `theme-purple`
- `theme-green`

Change the theme by updating the `NEXT_PUBLIC_THEME` environment variable.

## 📝 License

This project is licensed under the Apache License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features.
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) - learn how to integrate Supabase for authentication.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
