import 'package:flutter/material.dart';

/// Paleta reducida: rojo (marca/comida), blanco (texto y foco) y neutros oscuros.
class AppColors {
  AppColors._();

  static const background = Color(0xFF0D0D0E);
  static const surface = Color(0xFF171718);
  static const surfaceHigh = Color(0xFF222224);
  static const border = Color(0xFF2E2E31);
  static const borderStrong = Color(0xFF4A4A4F);

  static const red = Color(0xFFD62828);
  static const redLight =
      Color(0xFFFF6B6B); // texto rojo legible sobre fondo oscuro
  static const redSoft = Color(0x26D62828); // fondo rojo translúcido

  static const textMuted = Color(0xFFA1A1A8);
}

/// Escala responsiva.
/// 1280 px de ancho (10.1" WXGA) = 1.0  ·  1920 px (15.6" Full HD) = 1.5
extension UiScale on BuildContext {
  double get scale => (MediaQuery.sizeOf(this).width / 1280).clamp(1.0, 1.5);
  double s(double value) => value * scale;
}

BoxDecoration panelDecoration(BuildContext context) => BoxDecoration(
      color: AppColors.surface,
      borderRadius: BorderRadius.circular(context.s(14)),
      border: Border.all(color: AppColors.border),
    );

class AppTheme {
  AppTheme._();

  /// Úsalo en MaterialApp(theme: AppTheme.dark)
  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.red,
          secondary: AppColors.red,
          surface: AppColors.surface,
        ),
        dividerColor: AppColors.border,
      );
}
