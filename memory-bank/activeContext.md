# Active Context: Meeting Analyzer

## Current Work Focus
1. **Core Application Structure:** Setting up the main Next.js App Router structure, including layout, navigation, and basic pages for meetings.
2. **Supabase Integration:** Defining database schema, setting up migrations, configuring RLS policies, and integrating Supabase client for data operations (authentication, storage, database interaction).
3. **Meeting Management UI:** Building the UI components for listing, viewing details, and creating new meetings, including file uploads.
4. **Meeting Details Layout:** Implementing a two-column layout for meeting details with player/timeline visualization on the left and tab content on the right.
5. **API Route Development:** Creating API routes needed by the frontend, such as fetching meeting details or related data like topics.
6. **Dependency Management:** Installing and configuring necessary libraries (e.g., `d3`, `@radix-ui/react-tabs`, Supabase clients).

## Recent Changes
- **Database Schema:** Defined and refined the schema for `meetings`, `meeting_participants`, `meeting_themes`, `meeting_comments`, and `accounts` tables using Supabase migrations.
- **RLS Policies:** Implemented Row Level Security policies for all relevant tables to ensure data privacy.
- **Supabase Client:** Refactored Supabase client interaction into a unified `SassClient` class (`src/lib/supabase/unified.ts`) for both SPA and server usage.
- **Meeting Creation:** Implemented the `NewMeeting` page (`src/app/app/meetings/new/page.tsx`) allowing users to input title, description, and upload a recording file. File is uploaded to Supabase Storage, and a meeting record is created in the database.
- **Meeting Details Page Layout:** Redesigned the meeting details page with a two-column layout:
  - Left column: Player and speaker timeline visualization
  - Right column: Content tabs (Overview, Transcript, Comments, ChatGPT)
- **Speaker Timeline Visualization:** Implemented a timeline view showing when each participant spoke during the meeting, with:
  - Color-coded blocks for each speaker
  - Percentage of speaking time
  - Time markers
  - Current playback position indicator
- **API Routes:** Created initial API routes, including `/api/meetings/[id]/topics` and `/api/meetings/[id]/transcript` (currently returning mock data).
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
- Using a two-column layout for the meeting details page to show player and speaker timeline visualization alongside content tabs.
- Implementing visual representation of speaker participation in timeline format rather than just showing percentage participation.

## Current Considerations
- Ensuring components correctly handle asynchronous data fetching and parameter access (especially with App Router).
- Maintaining consistency between TypeScript types (`src/lib/types.ts`) and the actual database schema.
- Handling potential errors during file upload and database insertion gracefully.
- Replacing mock data in API routes (like topics and transcript) with actual data fetching/processing logic.
- Addressing the persistent (likely cache-related) linter errors for module resolution in `src/app/app/meetings/[id]/page.tsx`.
- Connecting the mock speaker timeline to actual transcript data.
- Synchronizing player position with the timeline visualization.

## Next Steps
1. **Connect Player with Speaker Timeline:**
   - Synchronize the current playback position indicator with actual player timeupdate events.
   - Connect the speaker timeline blocks to the actual transcript segments.
   - Implement click handling on timeline segments to seek to the corresponding position in the recording.

2. **Implement `MeetingOverview` Component:**
   - Fetch actual topic data from the `/api/meetings/[id]/topics` endpoint (or implement direct fetching).
   - Use the fetched data to render the D3.js force-directed graph.
   - Replace the mock data generation in the API route with actual logic (e.g., fetching from `meeting_themes` table or calling an NLP service).

3. **Implement `MeetingTranscript` Component:**
   - Fetch the transcript data from the `/api/meetings/[id]/transcript` endpoint.
   - Display the diarized transcript with speaker information.
   - Implement synchronization between transcript selection and media playback.

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
- How to best handle synchronization between the media player, transcript, and speaker timeline in real-time?
- What approach should be used to generate the timeline visualization from actual transcript data? 