import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://hqkybuumgwpylkhlppxk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxa3lidXVtZ3dweWxraGxwcHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTU5ODUsImV4cCI6MjA2NTc5MTk4NX0.x5yF30xE3nB8FYAgZJbqEvCKul92DSekveN62Gb9C6E';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };