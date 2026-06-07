import 'package:flutter/foundation.dart';
import '../core/constants/app_roles.dart';
import '../models/app_user.dart';

/// Authentication + current-session state.
///
/// Phase 1 is UI-only: [signIn] accepts any of the seeded demo emails below
/// (password is ignored) so every role-based dashboard shell can be
/// reviewed without a live backend. [signIn] is a clearly-marked placeholder
/// for the real Supabase Auth call that lands once [SupabaseConfig] is wired
/// up in Phase 3.
class AuthService extends ChangeNotifier {
  AppUser? _currentUser;
  AppUser? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;

  bool _loading = false;
  bool get isLoading => _loading;

  String? _error;
  String? get error => _error;

  static final Map<String, AppUser> _demoAccounts = {
    'super@kobciye.com': const AppUser(
      id: 'demo-super',
      fullName: 'Amina Yusuf',
      email: 'super@kobciye.com',
      role: AppRole.superAdmin,
    ),
    'admin@kobciye.com': const AppUser(
      id: 'demo-admin',
      fullName: 'Maxamed Cali',
      email: 'admin@kobciye.com',
      role: AppRole.schoolAdmin,
      schoolId: 'demo-school-1',
    ),
    'teacher@kobciye.com': const AppUser(
      id: 'demo-teacher',
      fullName: 'Hodan Warsame',
      email: 'teacher@kobciye.com',
      role: AppRole.teacher,
      schoolId: 'demo-school-1',
    ),
    'accountant@kobciye.com': const AppUser(
      id: 'demo-accountant',
      fullName: 'Khadar Nuur',
      email: 'accountant@kobciye.com',
      role: AppRole.accountant,
      schoolId: 'demo-school-1',
    ),
    'parent@kobciye.com': const AppUser(
      id: 'demo-parent',
      fullName: 'Faadumo Xasan',
      email: 'parent@kobciye.com',
      role: AppRole.parent,
      schoolId: 'demo-school-1',
    ),
    'student@kobciye.com': const AppUser(
      id: 'demo-student',
      fullName: 'Yusuf Maxamed',
      email: 'student@kobciye.com',
      role: AppRole.student,
      schoolId: 'demo-school-1',
    ),
  };

  static List<AppUser> get demoAccounts => _demoAccounts.values.toList();

  /// Placeholder for the real `supabase.auth.signInWithPassword(...)` call.
  /// In demo mode, any password is accepted for a known seeded email.
  Future<bool> signIn({required String email, required String password}) async {
    _loading = true;
    _error = null;
    notifyListeners();

    await Future.delayed(const Duration(milliseconds: 700));

    final user = _demoAccounts[email.trim().toLowerCase()];
    if (user == null) {
      _error = 'No demo account found for that email.';
      _loading = false;
      notifyListeners();
      return false;
    }

    _currentUser = user;
    _loading = false;
    notifyListeners();
    return true;
  }

  Future<void> signOut() async {
    _currentUser = null;
    notifyListeners();
  }
}
