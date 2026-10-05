// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:hella_kds/main.dart';
import 'package:flutter_test/flutter_test.dart' as flutter_test;
import 'package:flutter/material.dart' as flutter_test;
import 'package:flutter/widgets.dart' as flutter_test;
import 'package:flutter/rendering.dart' as flutter_test;

void main() {
  flutter_test.testWidgets('Counter increments smoke test',
      (flutter_test.WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const HellaKdsApp());

    // Verify that our counter starts at 0.
    expect(find.text('0'), flutter_test.findsOneWidget);
    expect(find.text('1'), flutter_test.findsNothing);

    // Tap the '+' icon and trigger a frame.
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // Verify that our counter has incremented.
    expect(find.text('0'), flutter_test.findsNothing);
    expect(find.text('1'), flutter_test.findsOneWidget);
  });
}
