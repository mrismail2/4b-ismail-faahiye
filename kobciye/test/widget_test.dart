import 'package:flutter_test/flutter_test.dart';

import 'package:kobciye/app.dart';
import 'package:kobciye/core/widgets/app_logo.dart';

void main() {
  testWidgets('Kobciye app boots to the splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const KobciyeApp());
    await tester.pump();

    expect(find.byType(AppLogo), findsOneWidget);
    expect(find.textContaining('Learn'), findsOneWidget);

    // Let the splash screen's navigation timer fire so no timers remain pending.
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
  });
}
