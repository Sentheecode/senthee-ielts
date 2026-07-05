export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    const { createClient: supabaseCreateClient } = await import(
      "@supabase/supabase-js"
    );
    return supabaseCreateClient(url, key);
  } catch {
    return null;
  }
}
