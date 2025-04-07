# Active Context: Meeting Analyzer

## Current Work Focus
1. **Core Application Structure:** Setting up the main Next.js App Router structure, including layout, navigation, and basic pages for meetings.
2. **Supabase Integration:** Defining database schema, setting up migrations, configuring RLS policies, and integrating Supabase client for data operations (authentication, storage, database interaction).
3. **Meeting Management UI:** Building the UI components for listing, viewing details, and creating new meetings, including file uploads.
4. **API Route Development:** Creating API routes needed by the frontend, such as fetching meeting details or related data like topics.
5. **Dependency Management:** Installing and configuring necessary libraries (e.g., `d3`, `@radix-ui/react-tabs`, Supabase clients).

## Recent Changes
- **Database Schema:** Defined and refined the schema for `meetings`, `meeting_participants`, `meeting_themes`, `meeting_comments`, and `accounts` tables using Supabase migrations.
- **RLS Policies:** Implemented Row Level Security policies for all relevant tables to ensure data privacy.
- **Supabase Client:** Refactored Supabase client interaction into a unified `SassClient` class (`src/lib/supabase/unified.ts`) for both SPA and server usage.
- **Meeting Creation:** Implemented the `NewMeeting` page (`src/app/app/meetings/new/page.tsx`) allowing users to input title, description, and upload a recording file. File is uploaded to Supabase Storage, and a meeting record is created in the database.
- **Meeting Details Page:** Created the basic structure for the meeting details page (`src/app/app/meetings/[id]/page.tsx`) using Next.js dynamic routes.
- **API Routes:** Created initial API routes, including `/api/meetings/[id]/topics` (currently returning mock data).
- **Bug Fixes:**
    - Resolved multiple build errors related to missing dependencies (`d3`, `@radix-ui/react-tabs`).
    - Fixed errors related to accessing `params` asynchronously in both the meeting details page and the topics API route.
    - Corrected Supabase query errors by adding the `accounts` table and the foreign key relationship.
    - Resolved linter errors related to Supabase client usage and type inconsistencies.

## Active Decisions
- Sticking to Next.js App Router conventions for page and API route creation.
- Using Supabase for BaaS (Auth, DB, Storage).
- Implementing database changes via Supabase Migrations.
- Defining RLS policies early for security.
- Encapsulating Supabase interactions in a dedicated client class.
- Using `npx supabase gen types typescript` to keep types synchronized with the database schema.

## Current Considerations
- Ensuring components correctly handle asynchronous data fetching and parameter access (especially with App Router).
- Maintaining consistency between TypeScript types (`src/lib/types.ts`) and the actual database schema.
- Handling potential errors during file upload and database insertion gracefully.
- Replacing mock data in API routes (like topics) with actual data fetching/processing logic.
- Addressing the persistent (likely cache-related) linter errors for module resolution in `src/app/app/meetings/[id]/page.tsx`.

## Next Steps
1. **Refine Meeting Details Page:**
   - Ensure all data (title, description, duration, date, account) displays correctly.
   - Fix any remaining linter/type errors (potentially by restarting dev server/editor).
   - Implement the actual data fetching logic within the tab components (`MeetingOverview`, `MeetingTranscript`, etc.) instead of passing just the ID.
   - Connect the search input to filter the transcript.
2. **Implement `MeetingOverview` Component:**
   - Fetch actual topic data from the `/api/meetings/[id]/topics` endpoint (or implement direct fetching).
   - Use the fetched data to render the D3.js force-directed graph.
   - Replace the mock data generation in the API route with actual logic (e.g., fetching from `meeting_themes` table or calling an NLP service).
3. **Implement `MeetingTranscript` Component:**
   - Fetch the transcript data (likely stored in the `meetings` table `transcript` column or a separate file/table).
   - Display the diarized transcript.
   - Implement playback synchronization if `recording_url` is available.
4. **Implement `MeetingComments` Component:**
   - Fetch comments for the meeting from `meeting_comments` table.
   - Allow users to add new comments linked to timestamps (requires UI and API updates).
5. **Implement `MeetingChatGPT` Component:**
   - Define the interaction flow.
   - Set up API communication for sending context/queries and receiving responses.

## Open Questions
- How should transcription be triggered? (e.g., automatically after upload, manually via button?)
- Where will the actual transcript text be stored? (In the `meetings` table, separate table, or file storage?)
- What NLP service/logic will be used to generate the topics/themes for the overview graph?
- How should errors during asynchronous operations within tab components be handled and displayed to the user? 