import '../core/constants/app_roles.dart';

/// Mirrors the `profiles` table. The [role] value is the raw database value
/// (e.g. `school_admin`) and must never be translated for storage/redirect
/// logic — only its display label is translated in the UI layer.
class AppUser {
  final String id;
  final String fullName;
  final String email;
  final String role;
  final String? schoolId;
  final String? avatarUrl;

  const AppUser({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.schoolId,
    this.avatarUrl,
  });

  factory AppUser.fromMap(Map<String, dynamic> map) => AppUser(
        id: map['id'] as String,
        fullName: map['full_name'] as String? ?? '',
        email: map['email'] as String? ?? '',
        role: map['role'] as String? ?? AppRole.student,
        schoolId: map['school_id'] as String?,
        avatarUrl: map['avatar_url'] as String?,
      );

  String get initials {
    final parts = fullName.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty);
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
  }
}
