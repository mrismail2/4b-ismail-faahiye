import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'services/auth_service.dart';
import 'services/localization_service.dart';

/// Root widget for the Kobciye app — wires up state providers, localization
/// and the [GoRouter]-backed [MaterialApp].
class KobciyeApp extends StatefulWidget {
  const KobciyeApp({super.key});

  @override
  State<KobciyeApp> createState() => _KobciyeAppState();
}

class _KobciyeAppState extends State<KobciyeApp> {
  late final AuthService _auth;
  late final LocalizationService _localization;
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _auth = AuthService();
    _localization = LocalizationService()..load();
    _router = buildRouter(_auth);
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
        child: MaterialApp.router(
          title: 'Kobciye',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.light,
          routerConfig: _router,
        ),
      ),
    );
  }
}
