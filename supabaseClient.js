const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables from a local .env file if present
dotenv.config();

let cachedClient = null;

function getSupabaseClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase credentials are missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}

module.exports = { getSupabaseClient };
