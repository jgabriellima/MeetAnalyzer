import { createServerClient } from '@supabase/ssr'
import { ClientType, SassClient } from "@/lib/supabase/unified";
import { Database } from "../types";

// Versão para Server Components (usando cookies do next/headers)
export async function createServerComponent() {
  // Esta função deve ser usada apenas em Server Components ou Server Actions
  // Importamos cookies dinamicamente para evitar importar em client components
  const { cookies } = await import('next/headers');
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name) {
          try {
            // Obter o cookieStore e aguardar a resolução
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error('Erro ao acessar cookie:', error);
            return undefined;
          }
        },
        async set(name, value, options) {
          try {
            // Obter o cookieStore e aguardar a resolução
            const cookieStore = await cookies();
            cookieStore.set(name, value, options);
          } catch (error) {
            // Ignorar erros em ambientes onde cookies não podem ser modificados
            console.error('Erro ao definir cookie:', error);
          }
        },
        async remove(name, options) {
          try {
            // Obter o cookieStore e aguardar a resolução
            const cookieStore = await cookies();
            cookieStore.delete(name);
          } catch (error) {
            // Ignorar erros em ambientes onde cookies não podem ser modificados
            console.error('Erro ao remover cookie:', error);
          }
        },
      },
    }
  );
}

// Versão para Client Components (usando cookies do browser)
export function createClientComponent() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          // Usar cookies do browser diretamente
          const cookies = document.cookie.split(';').map(cookie => cookie.trim());
          const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name, value, options) {
          // Definir cookie no browser
          let cookie = `${name}=${value}`;
          
          if (options?.expires) {
            cookie += `; expires=${options.expires.toUTCString()}`;
          }
          
          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
          }
          
          if (options?.domain) {
            cookie += `; domain=${options.domain}`;
          }
          
          if (options?.path) {
            cookie += `; path=${options.path}`;
          } else {
            cookie += '; path=/';
          }
          
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`;
          }
          
          if (options?.secure) {
            cookie += '; secure';
          }
          
          document.cookie = cookie;
        },
        remove(name, options) {
          // Remover cookie definindo expiração no passado
          if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options?.path || '/'}`;
          }
        },
      },
    }
  );
}

// Aliases para compatibilidade com código existente
export async function createClient() {
  // Esta função só deve ser usada em Server Components
  return createServerComponent();
}

export function createClientSync() {
  // Esta função é mantida para compatibilidade
  return createClientComponent();
}

// Função para Server Actions e API Routes
export async function createSSRSassClient() {
  const client = await createServerComponent();
  return new SassClient(client, ClientType.SERVER);
}

// Função para Client Components
export function createClientSassClient() {
  const client = createClientComponent();
  return new SassClient(client, ClientType.SERVER);
}