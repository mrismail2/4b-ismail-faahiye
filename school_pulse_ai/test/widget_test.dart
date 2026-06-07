import 'package:flutter_test/flutter_test.dart';

import 'package:school_pulse_ai/app.dart';

void main() {
  testWidgets('App boots to splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const SchoolPulseApp());
    await tester.pump();

    expect(find.text('School Pulse AI'), findsWidgets);
  });
}
