/// Supabase connection placeholder.
///
/// Phase 1 shipped with no real backend connection. Phase 2 has now built
/// the database foundation — schema, functions and Row Level Security
/// policies live under database/ (see database/README section in the
/// project README for the full Phase 2 summary and run order).
///
/// The app itself still does NOT connect to Supabase yet: no real Auth,
/// no live queries. Real wiring (URL, anon key, Supabase Auth sign-in,
/// RLS-protected queries) is planned for Phase 3, once this placeholder
/// is filled in with a real project's URL and anon key.
///
/// SECURITY NOTE: only the `anon` key ever belongs here. The
/// `service_role` key must never be placed in frontend code — it
/// bypasses Row Level Security entirely.
class SupabaseConfig {
  SupabaseConfig._();

  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

  static bool get isConfigured =>
      supabaseUrl != 'YOUR_SUPABASE_URL' && supabaseAnonKey != 'YOUR_SUPABASE_ANON_KEY';
}
