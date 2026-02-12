
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jhbvvdwiqbhrghujtutj.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoYnZ2ZHdpcWJocmdodWp0dXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzY0MzUsImV4cCI6MjA4NjQ1MjQzNX0.00uh7EVzhDf9jCqMNqEwNeTRUZYQ00kVOA3OprV-1WU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
