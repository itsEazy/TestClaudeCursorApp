import { createClient } from '@supabase/supabase-js';

// Use the anon key for client-side access
const supabaseUrl = 'https://xtoipvaihlellopwthyf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0b2lwdmFpaGxlbGxvcHd0aHlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3Mjc0NDYsImV4cCI6MjA2NTMwMzQ0Nn0.biqOhDYNIMFEag-87YJCF5msdZdHJsl_3X3Qu8gGpGo';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
  },
});

export interface TestClaudeCursorMessage {
  id: number;
  created_at: string;
  java_string: string;
}

export const getHelloMessage = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('TestClaudeCursorTable')
      .select('java_string')
      .eq('id', 2)
      .single();

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data?.java_string || 'Hello World!';
  } catch (error) {
    console.error('Error fetching message from Supabase:', error);
    throw error;
  }
};
