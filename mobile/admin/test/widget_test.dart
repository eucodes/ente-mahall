import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ente_mahall_admin/main.dart';

void main() {
  testWidgets('renders the placeholder home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const EnteMahallAdminApp());

    expect(find.text('Ente Mahall Admin'), findsAtLeastNWidgets(1));
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
