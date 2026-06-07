import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../l10n/app_strings.dart';

/// Holds the current UI language (English / Somali) and persists the user's
/// choice across sessions. Default language is English.
///
/// Only visible UI strings are translated through this service — database
/// role values such as `school_admin` are never passed through [translate].
class LocalizationService extends ChangeNotifier {
  static const _prefsKey = 'school_pulse_language';

  AppLanguage _language = AppLanguage.english;
  AppLanguage get language => _language;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString(_prefsKey);
    if (code != null) {
      _language = AppLanguageCode.fromCode(code);
      notifyListeners();
    }
  }

  Future<void> setLanguage(AppLanguage language) async {
    if (_language == language) return;
    _language = language;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, language.code);
  }

  Future<void> toggle() => setLanguage(
        _language == AppLanguage.english ? AppLanguage.somali : AppLanguage.english,
      );

  String translate(String key) => AppStrings.of(key, _language);
}

/// Convenience extension so widgets can call `context.t('key')`.
extension LocalizationContext on BuildContext {
  LocalizationService get _localizationService =>
      dependOnInheritedWidgetOfExactType<_LocalizationScope>()!.service;

  String t(String key) => _localizationService.translate(key);

  AppLanguage get currentLanguage => _localizationService.language;
}

/// Wrap the app with this once [LocalizationService] is provided via Provider
/// to make `context.t()` rebuild on language change.
class LocalizationScope extends StatelessWidget {
  final LocalizationService service;
  final Widget child;

  const LocalizationScope({super.key, required this.service, required this.child});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: service,
      builder: (context, _) => _LocalizationScope(service: service, child: child),
    );
  }
}

class _LocalizationScope extends InheritedWidget {
  final LocalizationService service;

  const _LocalizationScope({required this.service, required super.child});

  @override
  bool updateShouldNotify(_LocalizationScope oldWidget) =>
      oldWidget.service.language != service.language;
}
