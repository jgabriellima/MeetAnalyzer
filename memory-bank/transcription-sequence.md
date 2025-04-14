# Transcription System Sequence Diagrams

## Audio Upload and Transcription Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API Routes
    participant SB as Supabase
    participant EF as Edge Function
    participant AAI as AssemblyAI
    participant ML as Modal Labs

    U->>FE: Upload Audio File
    FE->>API: POST /api/meetings/[id]/upload
    API->>SB: Upload to Storage
    API->>SB: Update meeting record
    API->>EF: Publish AUDIO_READY event
    
    EF->>AAI: Start Transcription
    AAI-->>EF: Return transcription_id
    EF->>SB: Update transcription_id & status
    
    AAI->>API: Webhook: Status Updates
    API->>SB: Update transcription status
    
    loop Until Complete
        FE->>API: GET /status
        API->>SB: Check status
        SB-->>API: Return current status
        API-->>FE: Return status
    end
    
    AAI->>API: Webhook: Transcription Complete
    API->>ML: Process transcription data
    ML->>SB: Store segments & metadata
    API->>SB: Update status to complete
    
    FE->>API: GET /transcript
    API->>SB: Fetch transcript data
    SB-->>API: Return transcript
    API-->>FE: Return formatted transcript
```

## Error Handling Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Routes
    participant SB as Supabase
    participant AAI as AssemblyAI
    
    FE->>API: Upload/Process Request
    
    alt Upload Error
        API->>SB: Upload Fails
        API->>SB: Update status: error
        API-->>FE: Return error details
    end
    
    alt Processing Error
        AAI->>API: Webhook: Error
        API->>SB: Update status: error
        API->>SB: Store error details
        FE->>API: GET /status
        API-->>FE: Return error state
    end
    
    alt Recovery Flow
        FE->>API: Retry Request
        API->>AAI: New Transcription
        AAI-->>API: New transcription_id
        API->>SB: Update status: processing
    end
```

## Status Management Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Routes
    participant SB as Supabase
    participant EV as EventBus
    
    Note over FE,EV: Status: uploaded
    
    API->>SB: Update status
    API->>EV: Publish StatusChange
    
    Note over FE,EV: Status: processing
    
    API->>SB: Update status
    API->>EV: Publish StatusChange
    
    alt Success Path
        Note over FE,EV: Status: completed
        API->>SB: Update status
        API->>EV: Publish Complete
    else Error Path
        Note over FE,EV: Status: error
        API->>SB: Update status
        API->>SB: Store error details
        API->>EV: Publish Error
    end
```

## Data Storage Flow

```mermaid
sequenceDiagram
    participant AAI as AssemblyAI
    participant API as API Routes
    participant SB as Supabase
    
    AAI->>API: Webhook: Transcription Complete
    
    par Store Segments
        API->>SB: Insert transcription_segments
    and Store Metadata
        API->>SB: Insert transcription_metadata
    and Store Speakers
        API->>SB: Insert transcription_speakers
    end
    
    API->>SB: Update meeting status
    
    Note over API,SB: All operations in transaction
```

## Implementation Notes

### Status Transitions
- `uploaded` → Initial state after file upload
- `processing` → Transcription in progress
- `completed` → Successfully processed
- `error` → Failed processing

### Error Handling Strategy
1. **Upload Errors**
   - Storage errors
   - File format issues
   - Size limitations

2. **Processing Errors**
   - Transcription service failures
   - Invalid audio format
   - Language detection issues

3. **Storage Errors**
   - Database constraints
   - Transaction failures
   - Concurrent updates

### Recovery Mechanisms
1. **Automatic Retry**
   - For transient failures
   - Configurable retry count
   - Exponential backoff

2. **Manual Retry**
   - User-initiated
   - Fresh transcription ID
   - Clear error state

### Data Integrity
1. **Transactions**
   - Atomic operations
   - Consistent state
   - Rollback on failure

2. **Validation**
   - Schema validation
   - Status transitions
   - Data constraints 