# Meeting Analyzer

Meeting Analyzer is an Open-Source web application designed to record, transcribe, and analyze business conversations, helping teams extract key insights, improve collaboration, and make data-driven decisions.

## The Problem

Valuable information shared during meetings (sales calls, customer interviews, internal discussions) is often lost or hard to recall. Manually reviewing recordings is time-consuming, and extracting meaningful patterns or action items is challenging.

## Our Solution

Meeting Analyzer provides a central hub to:

*   **Visualize Recordings:** Easily playback call recordings with speaker identification.
*   **Searchable Transcripts:** Quickly find specific moments or keywords within the conversation.
*   **Speaker Analysis:** Understand participation dynamics and speaking time.
*   **AI-Powered Insights (Future):** Automatically generate summaries, identify action items, track topics, and analyze sentiment.

## Target Audience

Teams and individuals across various departments (Sales, Customer Success, Product, Management) who rely on meetings and want to maximize their value.

## Key Value

*   **Save Time:** Reduce manual review with searchable transcripts and summaries.
*   **Unlock Insights:** Identify trends, customer feedback, and coaching opportunities.
*   **Improve Collaboration:** Easily share key moments and findings with colleagues.
*   **Data-Driven Decisions:** Base strategies and actions on actual conversation data.

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
