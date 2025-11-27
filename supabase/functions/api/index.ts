// Basic email/password auth proxy using Supabase Auth REST endpoints.
// Endpoints:
//  POST /api/register  { email, password, user_metadata? }
//  POST /api/login     { email, password }

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname.replace(/\/+$/, ''); // trim trailing slash
  const method = req.method.toUpperCase();

  if (method !== 'POST') {
    return json({ error: 'Only POST allowed' }, 405);
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return json({ error: 'Missing JSON body' }, 400);
    }

    const parts = pathname.split('/').filter(Boolean);
    const route = parts[parts.length - 1]; // last segment e.g., register|login

    const email: string | undefined = body.email;
    const password: string | undefined = body.password;
    if (!email || !password) {
      return json({ error: 'email and password are required' }, 400);
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json({ error: 'Supabase env vars not set' }, 500);
    }

    const callAuth = async (path: string, payload: any) => {
      const resp = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => null);
      return { status: resp.status, data };
    };

    if (route === 'register') {
      const user_metadata = body.user_metadata ?? undefined;
      const payload: any = { email, password };
      if (user_metadata) payload.user_metadata = user_metadata;

      const { status, data } = await callAuth('/signup', payload);
      return json(data ?? { error: 'No response from auth' }, status);
    }

    if (route === 'login') {
      // Use token endpoint for password grant to obtain session tokens
      const resp = await fetch(`${SUPABASE_URL}/auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: new URLSearchParams({
          grant_type: 'password',
          email,
          password,
        }),
      });
      const data = await resp.json().catch(() => null);
      return json(data ?? { error: 'No response from auth' }, resp.status);
    }

    return json({ error: 'Not Found' }, 404);
  } catch (err) {
    console.error('Function error', err);
    return json({ error: 'Internal server error' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
