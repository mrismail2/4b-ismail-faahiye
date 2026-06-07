/// Mirrors the future `profiles` table — kept intentionally small for
/// Phase 1's UI-only auth flow.
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

  String get initials {
    final parts = fullName.trim().split(RegExp(r'\s+'));
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
  }
}
