import { createClient as createSPAClient } from '@supabase/supabase-js';
import { Database } from '../types';
import { SassClient, ClientType } from './unified';

export function createClient() {
  return createSPAClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createSPASassClient() {
  const client = createClient();
  return new SassClient(client, ClientType.SPA);
}