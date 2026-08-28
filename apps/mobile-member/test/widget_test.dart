import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:ente_mahall_member/main.dart';

void main() {
  testWidgets('renders the placeholder home screen', (WidgetTester tester) async {
    await tester.pumpWidget(const EnteMahallMemberApp());

    expect(find.text('Ente Mahall'), findsOneWidget);
    expect(find.byType(Scaffold), findsOneWidget);
  });
}
