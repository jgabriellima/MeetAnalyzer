# SmartMeeting Recorder

SmartMeeting Recorder is a cross-platform desktop application that integrates seamlessly with the MeetingAnalyzer platform. It detects when a Zoom or Google Meet meeting starts—via API or local inference—records the meeting audio, and uploads the file automatically to the correct project or collection.

---

## 📌 Project Brief

### Goal

Build a cross-platform (macOS first, then Windows and Linux) app that:
- Detects Zoom/Google Meet meeting start (via API or system inference)
- Prompts user to confirm and assign the session to a project
- Records the audio with user consent
- Uploads the recording to the MeetingAnalyzer platform

### Core Requirements
- Detection via provider/adapter strategy (API and local fallback)
- Secure and private audio recording
- UI prompt for project tagging and confirmation
- Automatic upload to the assigned destination
- Optional Zoom/Meet account linking
- User authentication with MeetingAnalyzer to sync meeting metadata and permissions

---

## 🧠 Product Context

### Why this exists

Manual uploads in MeetingAnalyzer are impractical for most users. SmartMeeting Recorder automates this process, dramatically improving user experience and adoption.

### Problems Solved
- Tedious manual upload of meetings
- Incomplete data in MeetingAnalyzer
- Friction in capturing valuable conversations

### UX Goals
- Frictionless background operation
- Friendly UI prompts with categorization options
- Auto-upload with fallback support
- Optional account linking for improved accuracy
- Meeting context consistency through authenticated project association

---

## 🔁 Active Context

### Current Focus
- Dual-mode detection architecture (providers)
- Selecting optimal audio stack for macOS and Windows
- Designing prompt flow and category assignment
- Defining authentication workflow for MeetingAnalyzer integration

### Recent Changes
- Chosen tech stack: Tauri + Rust + React
- Scope updated to support Zoom/Meet OAuth
- Prioritized MVP for inference-based detection

---

## 🧱 System Patterns

### Architecture
- Tauri cross-platform app
- Rust backend, Web-based UI
- Components: Provider (Detector), Recorder, Uploader, UI
- Auth and session management integrated with MeetingAnalyzer SDK/API

### Design Patterns
- Provider/Adapter for extensibility
- Observer for event watching
- Command for execution workflows
- Singleton services for monitoring and auth state

### Flow
- Detector triggers Recorder
- Recorder stores local audio
- UI prompt confirms upload and assigns context
- Adapter pushes to MeetingAnalyzer with authenticated user session

---

## 🛠 Tech Context

### Stack
- **Framework**: Tauri (Rust + WebView)
- **Audio Capture**:
  - macOS: AVFoundation / BlackHole
  - Windows: WASAPI / FFmpeg bindings
- **UI**: React or Svelte
- **Uploader**: HTTPS to MeetingAnalyzer API
- **Authentication**: OAuth or token-based session from MeetingAnalyzer

### Constraints
- macOS & Windows permission models
- Secure system access to mic/audio
- OAuth or token login required for full functionality

### Dependencies
- Tauri
- BlackHole (macOS)
- FFmpeg or cpal (Windows)
- MeetingAnalyzer SDK or API for auth, upload, and project resolution

---

## 🧭 Roadmap

### Milestone 1: Setup
- [x] Choose framework (Tauri)
- [ ] Bootstrap repo and modular structure

### Milestone 2: Detection MVP
- [ ] Build `LocalInferenceProvider`
- [ ] UI Prompt prototype
- [ ] macOS audio capture

### Milestone 3: Upload MVP
- [ ] Adapter for MeetingAnalyzer
- [ ] Metadata tagging + retry support

### Milestone 4: API Integration Mode
- [ ] OAuth for Zoom/Meet
- [ ] `ZoomAPIProvider` and `MeetAPIProvider`
- [ ] Authentication flow for MeetingAnalyzer

### Milestone 5: Windows Release
- [ ] WASAPI/FFmpeg integration
- [ ] System permissions + packaging

---

## 🧩 UX Flows

### Flow 1: Inference Mode
1. App detects process + audio activity
2. Prompts user to confirm and tag session
3. Recording begins
4. Upload on completion with project context

### Flow 2: API Mode
1. User links Zoom/Meet
2. App tracks scheduled meetings
3. Auto-start/stop recording
4. Upload without prompt (optional)

### Flow 3: Authenticated Workflow
1. On first use, user logs in with MeetingAnalyzer credentials
2. Session is maintained locally
3. Meetings are assigned only after auth to ensure project context

### Flow 4: Upload Failover
- File cached on failure
- Retry with exponential backoff
- User notified with retry option

---

## 🚀 Onboarding

### Requirements
- macOS 12+ or Windows 10+
- Mic/audio access permissions

### Getting Started
1. Install SmartMeeting Recorder
2. Grant microphone/system audio permissions
3. Authenticate with MeetingAnalyzer (mandatory)
4. (Optional) Link Zoom/Meet accounts

### First Use
- App runs in tray
- Detects meetings and asks for confirmation
- User assigns to project or collection
- Recording begins and uploads upon completion

### Support
- Docs: [docs.meetinganalyzer.io/smartrecorder](https://docs.meetinganalyzer.io/smartrecorder)
- Email: support@meetinganalyzer.io

