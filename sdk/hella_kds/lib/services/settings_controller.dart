import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Ajustes globales de la app. Se guardan en el dispositivo (shared_preferences)
/// y cualquier widget que los lea se reconstruye al cambiarlos.
class SettingsController extends ChangeNotifier {
  SettingsController._(
    this._prefs, {
    required this.stationName,
    required this.density,
    required this.sound,
    required this.notes,
  });

  static const densities = ['Compacto', 'Cómodo', 'Amplio'];
  static const sounds = ['Campana', 'Timbre', 'Silencio'];
  static const defaultStation = 'Cocina principal';
  static const defaultNotes =
      'Revisar alérgenos antes de cada servicio. Confirmar montaje para domicilios.';

  final SharedPreferences _prefs;

  String stationName;
  int density; // índice en [densities]
  String sound;
  String notes;

  static Future<SettingsController> load() async {
    final p = await SharedPreferences.getInstance();
    final savedSound = p.getString('sound');
    return SettingsController._(
      p,
      stationName: p.getString('station') ?? defaultStation,
      density: (p.getInt('density') ?? 1).clamp(0, densities.length - 1),
      sound: sounds.contains(savedSound) ? savedSound! : sounds.first,
      notes: p.getString('notes') ?? defaultNotes,
    );
  }

  /// Multiplicador de tamaño de toda la interfaz según la densidad elegida.
  double get densityFactor => const [0.9, 1.0, 1.12][density];

  Future<void> save({
    required String stationName,
    required int density,
    required String sound,
    required String notes,
  }) async {
    this.stationName =
        stationName.trim().isEmpty ? defaultStation : stationName.trim();
    this.density = density;
    this.sound = sound;
    this.notes = notes.trim();
    notifyListeners(); // la app cambia al instante
    await Future.wait([
      _prefs.setString('station', this.stationName),
      _prefs.setInt('density', this.density),
      _prefs.setString('sound', this.sound),
      _prefs.setString('notes', this.notes),
    ]);
  }

  /// Llámalo cuando llegue un pedido nuevo (o para probar el sonido).
  /// Usa el sonido del sistema; para tonos distintos agrega el paquete
  /// `audioplayers` y reproduce un asset según [sound].
  void playNewOrderSound([String? name]) {
    if ((name ?? sound) == 'Silencio') return;
    SystemSound.play(SystemSoundType.alert);
  }
}

class SettingsScope extends InheritedNotifier<SettingsController> {
  const SettingsScope({
    super.key,
    required SettingsController controller,
    required super.child,
  }) : super(notifier: controller);

  static SettingsController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<SettingsScope>();
    assert(scope != null, 'Falta SettingsScope sobre MaterialApp');
    return scope!.notifier!;
  }

  static SettingsController? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<SettingsScope>()?.notifier;
}
