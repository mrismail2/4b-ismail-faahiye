/// Supabase connection placeholder.
///
/// Phase 1 ships with no real backend connection — these are placeholders
/// only. Real Supabase wiring (URL, anon key, Auth, RLS-protected queries)
/// will be added in Phase 3, once the database schema from Phase 2 exists.
class SupabaseConfig {
  SupabaseConfig._();

  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

  static bool get isConfigured =>
      supabaseUrl != 'YOUR_SUPABASE_URL' && supabaseAnonKey != 'YOUR_SUPABASE_ANON_KEY';
}
