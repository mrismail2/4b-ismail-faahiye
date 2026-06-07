import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../core/constants/supabase_config.dart';

/// Thin wrapper around the Supabase client lifecycle.
///
/// Phase 1 only initializes the client when real credentials are supplied via
/// `--dart-define`. Until then [isReady] is false and the rest of the app
/// runs against local mock data (see [services/auth_service.dart]).
///
/// Security note: this file only ever uses the public anon key. The
/// `service_role` key must stay on the server (e.g. Supabase Edge Functions)
/// and must never be referenced from Flutter web code.
class SupabaseService {
  SupabaseService._();
  static final SupabaseService instance = SupabaseService._();

  bool _ready = false;
  bool get isReady => _ready;

  Future<void> init() async {
    if (!SupabaseConfig.isConfigured) {
      debugPrint('[SupabaseService] Skipping init — placeholder credentials in use (demo mode).');
      return;
    }
    await Supabase.initialize(
      url: SupabaseConfig.url,
      anonKey: SupabaseConfig.anonKey,
    );
    _ready = true;
  }

  SupabaseClient get client => Supabase.instance.client;
}
