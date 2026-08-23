// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não encontradas. ' +
      'Confere se o arquivo .env existe na raiz do projeto (baseado no .env.example).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);