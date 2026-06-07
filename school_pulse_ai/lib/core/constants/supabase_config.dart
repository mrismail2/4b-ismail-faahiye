/// Supabase project configuration.
///
/// PHASE 1 PLACEHOLDER — replace with your real project values before
/// connecting to a live backend. Never commit the `service_role` key here or
/// anywhere in the frontend; only the public anon key belongs in the client.
///
/// Recommended: load these from `--dart-define` at build time instead of
/// hardcoding, e.g.
///   flutter run -d chrome \
///     --dart-define=SUPABASE_URL=https://xxxx.supabase.co \
///     --dart-define=SUPABASE_ANON_KEY=eyJhbGciOi...
class SupabaseConfig {
  SupabaseConfig._();

  static const String url = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://YOUR-PROJECT.supabase.co',
  );

  static const String anonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'YOUR-PUBLIC-ANON-KEY',
  );

  /// Whether real Supabase credentials have been provided. While this is
  /// false the app runs in local "demo" mode using mock data so the UI can be
  /// built and reviewed before the backend is wired up (Phase 2+).
  static bool get isConfigured =>
      url != 'https://YOUR-PROJECT.supabase.co' && anonKey != 'YOUR-PUBLIC-ANON-KEY';
}
