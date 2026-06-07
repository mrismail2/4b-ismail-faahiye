import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'l10n/app_strings.dart';
import 'services/auth_service.dart';
import 'services/localization_service.dart';

/// Root widget — wires up Provider state (auth + localization), the router
/// and the global theme.
class SchoolPulseApp extends StatefulWidget {
  const SchoolPulseApp({super.key});

  @override
  State<SchoolPulseApp> createState() => _SchoolPulseAppState();
}

class _SchoolPulseAppState extends State<SchoolPulseApp> {
  late final AuthService _auth = AuthService();
  late final LocalizationService _localization = LocalizationService();
  late final _router = buildRouter(_auth);

  @override
  void initState() {
    super.initState();
    _localization.load();
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthService>.value(value: _auth),
        ChangeNotifierProvider<LocalizationService>.value(value: _localization),
      ],
      child: LocalizationScope(
        service: _localization,
        child: Builder(
          builder: (context) {
            return MaterialApp.router(
              title: AppStrings.of('appName', context.currentLanguage),
              debugShowCheckedModeBanner: false,
              theme: AppTheme.light,
              routerConfig: _router,
            );
          },
        ),
      ),
    );
  }
}
