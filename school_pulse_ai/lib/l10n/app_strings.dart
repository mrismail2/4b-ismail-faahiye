/// Supported UI languages.
enum AppLanguage { english, somali }

extension AppLanguageCode on AppLanguage {
  String get code => this == AppLanguage.english ? 'en' : 'so';

  String get label => this == AppLanguage.english ? 'English' : 'Af-Soomaali';

  static AppLanguage fromCode(String code) =>
      code == 'so' ? AppLanguage.somali : AppLanguage.english;
}

/// Simple key-based translation table for visible UI strings only.
///
/// IMPORTANT: database role values (e.g. `school_admin`, `teacher`) are never
/// translated — only user-facing labels are looked up here.
class AppStrings {
  AppStrings._();

  static const Map<String, Map<AppLanguage, String>> _table = {
    // Splash
    'appName': {
      AppLanguage.english: 'School Pulse AI',
      AppLanguage.somali: 'School Pulse AI',
    },
    'appTagline': {
      AppLanguage.english: 'School Intelligence, Reimagined',
      AppLanguage.somali: 'Fahamka Dugsiga, Si Cusub',
    },

    // Login
    'welcomeBack': {
      AppLanguage.english: 'Welcome back',
      AppLanguage.somali: 'Soo dhowow',
    },
    'loginSubtitle': {
      AppLanguage.english: 'Sign in to continue to your dashboard',
      AppLanguage.somali: 'Gal si aad u sii wadato dashboard-kaaga',
    },
    'email': {
      AppLanguage.english: 'Email address',
      AppLanguage.somali: 'Cinwaanka iimaylka',
    },
    'password': {
      AppLanguage.english: 'Password',
      AppLanguage.somali: 'Furaha sirta ah',
    },
    'signIn': {
      AppLanguage.english: 'Sign in',
      AppLanguage.somali: 'Gal',
    },
    'forgotPassword': {
      AppLanguage.english: 'Forgot password?',
      AppLanguage.somali: 'Ma ilowday furaha?',
    },
    'noAccount': {
      AppLanguage.english: "Don't have an account? Contact your school admin",
      AppLanguage.somali: 'Ma lihid account? La xiriir maamulaha dugsigaaga',
    },
    'language': {
      AppLanguage.english: 'Language',
      AppLanguage.somali: 'Luqadda',
    },

    // Roles (display labels — DB values stay untranslated)
    'role_super_admin': {
      AppLanguage.english: 'Super Admin',
      AppLanguage.somali: 'Maamule Guud',
    },
    'role_school_admin': {
      AppLanguage.english: 'School Admin',
      AppLanguage.somali: 'Maamulaha Dugsiga',
    },
    'role_teacher': {
      AppLanguage.english: 'Teacher',
      AppLanguage.somali: 'Macallin',
    },
    'role_accountant': {
      AppLanguage.english: 'Accountant',
      AppLanguage.somali: 'Xisaabiye',
    },
    'role_parent': {
      AppLanguage.english: 'Parent',
      AppLanguage.somali: 'Waalid',
    },
    'role_student': {
      AppLanguage.english: 'Student',
      AppLanguage.somali: 'Arday',
    },

    // Navigation / common
    'dashboard': {
      AppLanguage.english: 'Dashboard',
      AppLanguage.somali: 'Guriga',
    },
    'students': {
      AppLanguage.english: 'Students',
      AppLanguage.somali: 'Ardayda',
    },
    'attendance': {
      AppLanguage.english: 'Attendance',
      AppLanguage.somali: 'Xaadiriska',
    },
    'riskScore': {
      AppLanguage.english: 'Risk Score',
      AppLanguage.somali: 'Heerka Khatarta',
    },
    'payments': {
      AppLanguage.english: 'Payments',
      AppLanguage.somali: 'Lacag-bixinta',
    },
    'mobileMoney': {
      AppLanguage.english: 'Mobile Money',
      AppLanguage.somali: 'Lacagta Mobilka',
    },
    'feePromises': {
      AppLanguage.english: 'Fee Promises',
      AppLanguage.somali: 'Balanqaadyada Lacagta',
    },
    'quranProgress': {
      AppLanguage.english: 'Qur’an Progress',
      AppLanguage.somali: 'Horumarka Qur’aanka',
    },
    'timeline': {
      AppLanguage.english: 'Timeline',
      AppLanguage.somali: 'Taariikhda',
    },
    'settings': {
      AppLanguage.english: 'Settings',
      AppLanguage.somali: 'Dejinta',
    },
    'billing': {
      AppLanguage.english: 'Billing',
      AppLanguage.somali: 'Lacag-bixinta',
    },
    'logout': {
      AppLanguage.english: 'Log out',
      AppLanguage.somali: 'Ka bax',
    },
    'comingSoon': {
      AppLanguage.english: 'This module is coming in the next phase',
      AppLanguage.somali: 'Qaybtan waxay imanaysaa marxaladda xigta',
    },
    'overview': {
      AppLanguage.english: 'Overview',
      AppLanguage.somali: 'Guudmar',
    },
    'goodMorning': {
      AppLanguage.english: 'Good morning',
      AppLanguage.somali: 'Subax wanaagsan',
    },
    'highRisk': {
      AppLanguage.english: 'High Risk',
      AppLanguage.somali: 'Khatar Sare',
    },
    'mediumRisk': {
      AppLanguage.english: 'Medium Risk',
      AppLanguage.somali: 'Khatar Dhexe',
    },
    'lowRisk': {
      AppLanguage.english: 'Low Risk',
      AppLanguage.somali: 'Khatar Hooseysa',
    },
    'unpaidFees': {
      AppLanguage.english: 'Unpaid Fees',
      AppLanguage.somali: 'Lacago Aan La Bixin',
    },
    'attendanceRate': {
      AppLanguage.english: 'Attendance Rate',
      AppLanguage.somali: 'Heerka Xaadiriska',
    },
    'pendingSync': {
      AppLanguage.english: 'Pending Sync',
      AppLanguage.somali: 'Sugaya in la Sync-gareeyo',
    },
  };

  static String of(String key, AppLanguage lang) {
    final entry = _table[key];
    if (entry == null) return key;
    return entry[lang] ?? entry[AppLanguage.english] ?? key;
  }
}
