import 'package:flutter/material.dart';

class AppTheme {
  static const amber = Color(0xFFF5A524);
  static const red = Color(0xFFE23B2E);
  static const background = Color(0xFF101214);
  static const surface = Color(0xFF191C20);
  static const surfaceRaised = Color(0xFF23272D);
  static final dark = ThemeData.dark().copyWith(
    scaffoldBackgroundColor: background,
    colorScheme: const ColorScheme.dark(primary: amber, secondary: red, surface: surface),
    textTheme: ThemeData.dark().textTheme.apply(fontFamily: 'Arial'),
    cardTheme: CardThemeData(color: surface, margin: EdgeInsets.zero, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18))),
  );
}
