import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsxlupjxwasihdumykge.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeGx1cGp4d2FzaWhkdW15a2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTYwNTIsImV4cCI6MjA1OTczMjA1Mn0.Ei_yO9chrxZ7dZo5KHr2rdOnEKqFX4HGnc5Px3VL-q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
