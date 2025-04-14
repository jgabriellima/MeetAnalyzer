import {SupabaseClient} from "@supabase/supabase-js";
import {Database} from "@/lib/types";

export enum ClientType {
    SERVER = 'server',
    SPA = 'spa'
}

export class SassClient {
    private client: SupabaseClient<Database>;
    private clientType: ClientType;

    constructor(client: SupabaseClient<Database>, clientType: ClientType) {
        this.client = client;
        this.clientType = clientType;
    }

    // Auth methods
    get auth() {
        return this.client.auth;
    }

    // Storage methods
    get storage() {
        return this.client.storage;
    }

    // Database methods
    from<T extends keyof Database['public']['Tables']>(
        table: T
    ) {
        return this.client.from(table);
    }

    // Realtime methods
    get realtime() {
        return this.client.realtime;
    }

    // Helper methods for transcription
    async getMeeting(id: string) {
        const { data, error } = await this.from('meetings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateMeetingTranscriptionStatus(
        id: string,
        status: string,
        error?: string
    ) {
        const { data, error: updateError } = await this.from('meetings')
            .update({
                transcription_status: status,
                transcription_error: error,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;
        return data;
    }

    async getTranscriptionSegments(meetingId: string) {
        const { data, error } = await this.from('transcription_segments')
            .select('*')
            .eq('meeting_id', meetingId)
            .order('start_time', { ascending: true });

        if (error) throw error;
        return data;
    }

    async getTranscriptionMetadata(meetingId: string, type?: string) {
        const query = this.from('transcription_metadata')
            .select('*')
            .eq('meeting_id', meetingId);

        if (type) {
            query.eq('metadata_type', type);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }

    async getTranscriptionSpeakers(meetingId: string) {
        const { data, error } = await this.from('transcription_speakers')
            .select('*')
            .eq('meeting_id', meetingId);

        if (error) throw error;
        return data;
    }

    async upsertTranscriptionSegments(
        meetingId: string,
        segments: Array<{
            speaker_id?: string;
            start_time: number;
            end_time: number;
            text: string;
            confidence?: number;
        }>
    ) {
        const { data, error } = await this.from('transcription_segments')
            .upsert(
                segments.map(segment => ({
                    meeting_id: meetingId,
                    ...segment,
                    created_at: new Date().toISOString()
                }))
            )
            .select();

        if (error) throw error;
        return data;
    }

    async upsertTranscriptionMetadata(
        meetingId: string,
        type: string,
        data: any
    ) {
        const { data: result, error } = await this.from('transcription_metadata')
            .upsert({
                meeting_id: meetingId,
                metadata_type: type,
                data,
                created_at: new Date().toISOString()
            })
            .select();

        if (error) throw error;
        return result;
    }

    async upsertTranscriptionSpeakers(
        meetingId: string,
        speakers: Array<{
            speaker_id: string;
            speaker_name?: string;
            speaking_time?: number;
        }>
    ) {
        const { data, error } = await this.from('transcription_speakers')
            .upsert(
                speakers.map(speaker => ({
                    meeting_id: meetingId,
                    ...speaker,
                    created_at: new Date().toISOString()
                }))
            )
            .select();

        if (error) throw error;
        return data;
    }

    async loginEmail(email: string, password: string) {
        return this.client.auth.signInWithPassword({
            email: email,
            password: password
        });
    }

    async registerEmail(email: string, password: string) {
        return this.client.auth.signUp({
            email: email,
            password: password
        });
    }

    async exchangeCodeForSession(code: string) {
        return this.client.auth.exchangeCodeForSession(code);
    }

    async resendVerificationEmail(email: string) {
        return this.client.auth.resend({
            email: email,
            type: 'signup'
        })
    }

    async logout() {
        const { error } = await this.client.auth.signOut({
            scope: 'local'
        });
        if (error) throw error;
        if(this.clientType === ClientType.SPA) {
            window.location.href = '/auth/login';
        }
    }

    async uploadFile(bucket: string, path: string, file: File) {
        return this.client.storage.from(bucket).upload(path, file);
    }

    async getFiles(myId: string) {
        return this.client.storage.from('files').list(myId)
    }

    async deleteFile(myId: string, filename: string) {
        filename = myId + "/" + filename
        return this.client.storage.from('files').remove([filename])
    }

    async shareFile(myId: string, filename: string, timeInSec: number, forDownload: boolean = false) {
        filename = myId + "/" + filename
        return this.client.storage.from('files').createSignedUrl(filename, timeInSec, {
            download: forDownload
        });
    }

    async getMyTodoList(page: number = 1, pageSize: number = 100, order: string = 'created_at', done: boolean | null = false) {
        let query = this.client.from('todo_list').select('*').range(page * pageSize - pageSize, page * pageSize - 1).order(order)
        if (done !== null) {
            query = query.eq('done', done)
        }
        return query
    }

    async createTask(row: Database["public"]["Tables"]["todo_list"]["Insert"]) {
        return this.client.from('todo_list').insert(row)
    }

    async removeTask(id: number) {
        return this.client.from('todo_list').delete().eq('id', id)
    }

    async updateAsDone(id: number) {
        return this.client.from('todo_list').update({done: true}).eq('id', id)
    }

    getSupabaseClient() {
        return this.client;
    }

    async getUser() {
        const { data, error } = await this.client.auth.getUser();
        if (error) throw error;
        return data.user;
    }

    async getPublicUrl(bucket: string, path: string) {
        return {
            data: this.client.storage.from(bucket).getPublicUrl(path).data.publicUrl
        };
    }
}
