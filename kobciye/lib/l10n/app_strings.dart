/// Supported UI languages. Default is English; Somali / Af-Soomaali is the
/// secondary language Kobciye is built to support strongly.
///
/// IMPORTANT: only visible UI strings go through this table — database
/// role values (see `AppRole`) are never translated.
enum AppLanguage { english, somali }

extension AppLanguageCode on AppLanguage {
  String get code => this == AppLanguage.english ? 'en' : 'so';

  String get label => this == AppLanguage.english ? 'English' : 'Af-Soomaali';

  static AppLanguage fromCode(String code) =>
      code == 'so' ? AppLanguage.somali : AppLanguage.english;
}

/// Simple key -> {language: text} translation table.
///
/// Phase 1 only needs enough keys to cover the screens that ship now —
/// the structure is built so more keys can be appended freely later.
class AppStrings {
  AppStrings._();

  static String of(String key, AppLanguage language) {
    final entry = _table[key];
    if (entry == null) return key;
    return entry[language] ?? entry[AppLanguage.english] ?? key;
  }

  static const Map<String, Map<AppLanguage, String>> _table = {
    'appName': {
      AppLanguage.english: 'Kobciye',
      AppLanguage.somali: 'Kobciye',
    },
    'tagline': {
      AppLanguage.english: 'Learn • Grow • Succeed',
      AppLanguage.somali: 'Baro • Koboc • Guulayso',
    },

    // Navigation / sidebar
    'dashboard': {
      AppLanguage.english: 'Dashboard',
      AppLanguage.somali: 'Shaashadda Maamulka',
    },
    'students': {
      AppLanguage.english: 'Students',
      AppLanguage.somali: 'Ardayda',
    },
    'parents': {
      AppLanguage.english: 'Parents',
      AppLanguage.somali: 'Waalidiinta',
    },
    'teachers': {
      AppLanguage.english: 'Teachers',
      AppLanguage.somali: 'Macallimiinta',
    },
    'classes': {
      AppLanguage.english: 'Classes',
      AppLanguage.somali: 'Fasallada',
    },
    'attendance': {
      AppLanguage.english: 'Attendance',
      AppLanguage.somali: 'Xaadiriska',
    },
    'payments': {
      AppLanguage.english: 'Payments',
      AppLanguage.somali: 'Lacag-bixinta',
    },
    'exams': {
      AppLanguage.english: 'Exams',
      AppLanguage.somali: 'Imtixaannada',
    },
    'results': {
      AppLanguage.english: 'Results',
      AppLanguage.somali: 'Natiijooyinka',
    },
    'riskScore': {
      AppLanguage.english: 'Risk Score',
      AppLanguage.somali: 'Qiimeynta Khatarta',
    },
    'quranProgress': {
      AppLanguage.english: 'Qur\'an Progress',
      AppLanguage.somali: 'Horumarka Qur\'aanka',
    },
    'progress': {
      AppLanguage.english: 'Progress',
      AppLanguage.somali: 'Horumarka',
    },
    'reports': {
      AppLanguage.english: 'Reports',
      AppLanguage.somali: 'Warbixinnada',
    },
    'timeline': {
      AppLanguage.english: 'Timeline',
      AppLanguage.somali: 'Taariikhda',
    },
    'notices': {
      AppLanguage.english: 'Notices',
      AppLanguage.somali: 'Ogeysiisyada',
    },
    'notes': {
      AppLanguage.english: 'Notes',
      AppLanguage.somali: 'Qoraallada',
    },
    'settings': {
      AppLanguage.english: 'Settings',
      AppLanguage.somali: 'Dejinta',
    },
    'logout': {
      AppLanguage.english: 'Log out',
      AppLanguage.somali: 'Ka bax',
    },

    // Generic
    'overview': {
      AppLanguage.english: 'Overview',
      AppLanguage.somali: 'Guudmar',
    },
    'goodMorning': {
      AppLanguage.english: 'Good morning',
      AppLanguage.somali: 'Subax wanaagsan',
    },
    'comingSoon': {
      AppLanguage.english: 'Coming in a later phase',
      AppLanguage.somali: 'Wuxuu iman doonaa marxalad xigta',
    },

    // Roles
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

    // Auth
    'welcomeBack': {
      AppLanguage.english: 'Welcome back',
      AppLanguage.somali: 'Soo dhowow mar kale',
    },
    'signInToContinue': {
      AppLanguage.english: 'Sign in to your Kobciye dashboard',
      AppLanguage.somali: 'Gal akoonkaaga Kobciye si aad u sii wadato',
    },
    'email': {
      AppLanguage.english: 'Email',
      AppLanguage.somali: 'Iimaylka',
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
      AppLanguage.somali: 'Ma illowday furahaaga?',
    },
    'requestSchoolAccount': {
      AppLanguage.english: 'Request a school account',
      AppLanguage.somali: 'Codso akoon dugsi',
    },

    // Onboarding / landing
    'getStarted': {
      AppLanguage.english: 'Get started',
      AppLanguage.somali: 'Bilow',
    },
    'login': {
      AppLanguage.english: 'Login',
      AppLanguage.somali: 'Soo gal',
    },
  };
}
