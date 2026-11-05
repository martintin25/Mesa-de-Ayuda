import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxxqxftovrdzeaqmdcdo.supabase.co';
const supabaseAnonKey = 'sb_publishable_eHLP1_apad-fCcxpgmrx3g_REXCOcwC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
