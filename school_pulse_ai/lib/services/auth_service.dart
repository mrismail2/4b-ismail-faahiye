import 'package:flutter/foundation.dart';
import '../core/constants/app_roles.dart';
import '../core/constants/supabase_config.dart';
import '../models/app_user.dart';
import 'supabase_service.dart';

/// Authentication + current-session state.
///
/// Real flow (Phase 2+, when Supabase is configured):
///   1. Sign in via Supabase Auth (email/password)
///   2. Fetch the matching row from `profiles` (id = auth.uid())
///   3. `role` on that row decides which dashboard the user lands on
///
/// Demo flow (Phase 1, no backend configured):
///   The login screen accepts any of the seeded demo emails below so the
///   role-based shells can be reviewed without a live Supabase project.
/// The user never picks a role themselves — it always comes from the profile.
class AuthService extends ChangeNotifier {
  AppUser? _currentUser;
  AppUser? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  bool _loading = false;
  bool get isLoading => _loading;

  String? _error;
  String? get error => _error;

  /// Demo accounts — email -> profile. Password is ignored in demo mode.
  static final Map<String, AppUser> _demoAccounts = {
    'super@schoolpulse.ai': const AppUser(
      id: 'demo-super',
      fullName: 'Hodan Warsame',
      email: 'super@schoolpulse.ai',
      role: AppRole.superAdmin,
    ),
    'admin@schoolpulse.ai': const AppUser(
      id: 'demo-admin',
      fullName: 'Cabdiraxmaan Nuur',
      email: 'admin@schoolpulse.ai',
      role: AppRole.schoolAdmin,
      schoolId: 'demo-school-1',
    ),
    'teacher@schoolpulse.ai': const AppUser(
      id: 'demo-teacher',
      fullName: 'Sahra Maxamed',
      email: 'teacher@schoolpulse.ai',
      role: AppRole.teacher,
      schoolId: 'demo-school-1',
    ),
    'accountant@schoolpulse.ai': const AppUser(
      id: 'demo-accountant',
      fullName: 'Khalid Yusuf',
      email: 'accountant@schoolpulse.ai',
      role: AppRole.accountant,
      schoolId: 'demo-school-1',
    ),
    'parent@schoolpulse.ai': const AppUser(
      id: 'demo-parent',
      fullName: 'Faadumo Cali',
      email: 'parent@schoolpulse.ai',
      role: AppRole.parent,
      schoolId: 'demo-school-1',
    ),
    'student@schoolpulse.ai': const AppUser(
      id: 'demo-student',
      fullName: 'Ahmed Ali',
      email: 'student@schoolpulse.ai',
      role: AppRole.student,
      schoolId: 'demo-school-1',
    ),
  };

  Future<bool> signIn({required String email, required String password}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      if (SupabaseConfig.isConfigured && SupabaseService.instance.isReady) {
        final client = SupabaseService.instance.client;
        final res = await client.auth.signInWithPassword(email: email, password: password);
        final uid = res.user?.id;
        if (uid == null) {
          _error = 'invalid_credentials';
          return false;
        }
        final profile = await client.from('profiles').select().eq('id', uid).single();
        _currentUser = AppUser.fromMap(profile);
        return true;
      }

      // Demo mode: match a seeded account by email (any password accepted).
      await Future.delayed(const Duration(milliseconds: 500));
      final account = _demoAccounts[email.trim().toLowerCase()];
      if (account == null) {
        _error = 'invalid_credentials';
        return false;
      }
      _currentUser = account;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    if (SupabaseConfig.isConfigured && SupabaseService.instance.isReady) {
      await SupabaseService.instance.client.auth.signOut();
    }
    _currentUser = null;
    notifyListeners();
  }

  /// Demo-mode helper exposed to the login screen so it can show quick-access
  /// role buttons without requiring the user to type credentials.
  static List<AppUser> get demoAccounts => _demoAccounts.values.toList(growable: false);
}
