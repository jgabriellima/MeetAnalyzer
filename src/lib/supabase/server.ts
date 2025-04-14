import {createServerClient} from '@supabase/ssr'
import {cookies} from 'next/headers'
import {ClientType, SassClient} from "@/lib/supabase/unified";
import {Database} from "../types";

export function createSSRClient() {
    const cookieStore = cookies();

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle error
                    }
                },
                remove(name: string, options: any) {
                    try {
                        cookieStore.delete({ name, ...options });
                    } catch (error) {
                        // Handle error
                    }
                },
            },
        }
    );

    return new SassClient(supabase);
}

export async function createSSRSassClient() {
    const client = await createSSRClient();
    return new SassClient(client, ClientType.SERVER);
}