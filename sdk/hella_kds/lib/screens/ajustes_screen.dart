import 'package:flutter/material.dart';
import '../services/settings_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/tv_widgets.dart';

class AjustesScreen extends StatefulWidget {
  const AjustesScreen({super.key});

  @override
  State<AjustesScreen> createState() => _AjustesScreenState();
}

class _AjustesScreenState extends State<AjustesScreen> {
  final TextEditingController _stationCtrl = TextEditingController();
  final TextEditingController _notesCtrl = TextEditingController();

  late SettingsController _settings;
  bool _initialized = false;
  int _density = 1;
  String _sound = SettingsController.sounds.first;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _settings = SettingsScope.of(context);
    if (!_initialized) {
      _initialized = true;
      _loadDraft();
    }
  }

  void _loadDraft() {
    _stationCtrl.text = _settings.stationName;
    _notesCtrl.text = _settings.notes;
    _density = _settings.density;
    _sound = _settings.sound;
  }

  @override
  void dispose() {
    _stationCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  bool get _dirty =>
      _stationCtrl.text.trim() != _settings.stationName ||
      _notesCtrl.text.trim() != _settings.notes ||
      _density != _settings.density ||
      _sound != _settings.sound;

  Future<void> _save() async {
    await _settings.save(
      stationName: _stationCtrl.text,
      density: _density,
      sound: _sound,
      notes: _notesCtrl.text,
    );
    if (!mounted) return;
    setState(() => _loadDraft()); // refleja valores normalizados
    ScaffoldMessenger.maybeOf(context)?.showSnackBar(
      SnackBar(
        backgroundColor: AppColors.surfaceHigh,
        behavior: SnackBarBehavior.floating,
        content: Text('Configuración guardada y aplicada.',
            style: TextStyle(color: Colors.white, fontSize: context.s(15))),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final dirty = _dirty;
    return SingleChildScrollView(
      padding: EdgeInsets.all(context.s(28)),
      child: Align(
        alignment: Alignment.topLeft,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: context.s(820)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const ScreenHeader(
                title: 'Configuración',
                subtitle:
                    'Ajusta la estación de cocina y las preferencias de la pantalla.',
              ),
              SizedBox(height: context.s(28)),
              _label(context, 'NOMBRE DE LA ESTACIÓN'),
              TvTextField(
                controller: _stationCtrl,
                onChanged: (_) => setState(() {}),
              ),
              SizedBox(height: context.s(24)),
              _label(context, 'DENSIDAD DE LA PANTALLA'),
              Row(
                children: [
                  for (var i = 0;
                      i < SettingsController.densities.length;
                      i++) ...[
                    if (i > 0) SizedBox(width: context.s(14)),
                    Expanded(child: _densityTile(context, i)),
                  ],
                ],
              ),
              SizedBox(height: context.s(24)),
              _label(context, 'SONIDO DE NUEVO PEDIDO'),
              Row(
                children: [
                  TvDropdown(
                    value: _sound,
                    items: SettingsController.sounds,
                    width: context.s(320),
                    onChanged: (v) => setState(() => _sound = v),
                  ),
                  SizedBox(width: context.s(14)),
                  TvButton(
                    label: 'Probar',
                    icon: Icons.volume_up_outlined,
                    style: TvButtonStyle.outline,
                    height: context.s(52),
                    onPressed: () => _settings.playNewOrderSound(_sound),
                  ),
                ],
              ),
              SizedBox(height: context.s(24)),
              _label(context, 'NOTAS DE LA COCINA'),
              TvTextField(
                controller: _notesCtrl,
                maxLines: 4,
                onChanged: (_) => setState(() {}),
              ),
              SizedBox(height: context.s(32)),
              Row(
                children: [
                  SizedBox(
                    width: context.s(280),
                    child: TvButton(
                      label: 'Guardar configuración',
                      icon: Icons.save_outlined,
                      expand: true,
                      height: context.s(56),
                      fontSize: context.s(16),
                      onPressed: dirty ? _save : null,
                    ),
                  ),
                  if (dirty) ...[
                    SizedBox(width: context.s(14)),
                    TvButton(
                      label: 'Descartar',
                      style: TvButtonStyle.outline,
                      height: context.s(56),
                      fontSize: context.s(16),
                      onPressed: () => setState(_loadDraft),
                    ),
                    SizedBox(width: context.s(16)),
                    Icon(Icons.circle,
                        size: context.s(9), color: AppColors.redLight),
                    SizedBox(width: context.s(8)),
                    Text('Cambios sin guardar',
                        style: TextStyle(
                            fontSize: context.s(14),
                            color: AppColors.textMuted)),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _label(BuildContext context, String text) {
    return Padding(
      padding: EdgeInsets.only(bottom: context.s(10)),
      child: Text(text,
          style: TextStyle(
              fontSize: context.s(12),
              letterSpacing: 0.8,
              color: AppColors.textMuted,
              fontWeight: FontWeight.w800)),
    );
  }

  Widget _densityTile(BuildContext context, int index) {
    final selected = _density == index;
    return TvFocusable(
      radius: context.s(12),
      onTap: () => setState(() => _density = index),
      builder: (_, __) => AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        height: context.s(56),
        padding: EdgeInsets.symmetric(horizontal: context.s(16)),
        decoration: BoxDecoration(
          color: selected ? AppColors.redSoft : AppColors.surface,
          borderRadius: BorderRadius.circular(context.s(12)),
          border: Border.all(
              color: selected ? AppColors.red : AppColors.border,
              width: selected ? 2 : 1.2),
        ),
        child: Row(
          children: [
            Icon(
              selected
                  ? Icons.radio_button_checked
                  : Icons.radio_button_unchecked,
              color: selected ? AppColors.redLight : AppColors.textMuted,
              size: context.s(22),
            ),
            SizedBox(width: context.s(12)),
            Text(SettingsController.densities[index],
                style: TextStyle(
                    fontSize: context.s(16),
                    fontWeight: FontWeight.w700,
                    color: Colors.white)),
          ],
        ),
      ),
    );
  }
}
