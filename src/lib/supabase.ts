import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsbvnkwxwvffghrdxnxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYnZua3d4d3ZmZmdocmR4bnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0ODY1NTIsImV4cCI6MjA4NTA2MjU1Mn0.lT6ZSx9ZEwrLu-3olklSCr5cl_lq9xIcimFY8HBSKzg';

// For production flexibility, usually we use process.env.VITE_SUPABASE_URL
// but since the actual values were provided in the source, we stick to them.

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your configuration.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);