import 'package:flutter/material.dart';
import '../services/hella_api.dart';
import '../theme/app_theme.dart';
import '../widgets/tv_widgets.dart';

class _MenuDish {
  _MenuDish(this.id, this.name, this.category, {this.available = true});
  final int id;
  final String name;
  final String category;
  bool available;

  factory _MenuDish.fromJson(Map<String, dynamic> j) => _MenuDish(
        (j['id'] as num).toInt(),
        '${j['nombre']}',
        '${j['categoria_nombre'] ?? 'Sin categoría'}',
        available: j['disponible'] != false && j['disponible'] != 0,
      );
}

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  static const _all = 'Todas las categorías';

  List<_MenuDish> _dishes = [];
  bool _loading = true;
  String? _error;

  String _category = _all;

  List<String> get _categories =>
      [_all, ..._dishes.map((d) => d.category).toSet()];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await HellaApi.platillosRaw();
      if (!mounted) return;
      setState(() {
        _dishes = data.map(_MenuDish.fromJson).toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = '$e';
        _loading = false;
      });
    }
  }

  /// Cambia en pantalla al instante; si la API falla, lo revierte.
  Future<void> _toggle(_MenuDish d) async {
    final nuevo = !d.available;
    setState(() => d.available = nuevo);
    try {
      await HellaApi.kdsTogglePlatillo(d.id, nuevo);
    } catch (e) {
      if (!mounted) return;
      setState(() => d.available = !nuevo);
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(SnackBar(
        backgroundColor: AppColors.surfaceHigh,
        behavior: SnackBarBehavior.floating,
        content: Text('No se pudo actualizar: $e',
            style: TextStyle(color: Colors.white, fontSize: context.s(15))),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final available = _dishes.where((d) => d.available).length;
    final rows = _dishes
        .where((d) => _category == _all || d.category == _category)
        .toList();

    return Padding(
      padding: EdgeInsets.all(context.s(28)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ScreenHeader(
            title: 'Disponibilidad del menú',
            subtitle:
                '$available de ${_dishes.length} platillos disponibles. Los cambios se reflejarán en la web del cliente.',
            trailing: TvDropdown(
              value: _categories.contains(_category) ? _category : _all,
              items: _categories,
              onChanged: (v) => setState(() => _category = v),
            ),
          ),
          SizedBox(height: context.s(24)),
          Expanded(
            child: Container(
              decoration: panelDecoration(context),
              child: Column(
                children: [
                  _header(context),
                  Expanded(child: _content(context, rows)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _content(BuildContext context, List<_MenuDish> rows) {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: AppColors.redLight));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!,
                style: TextStyle(
                    fontSize: context.s(16), color: AppColors.textMuted)),
            SizedBox(height: context.s(16)),
            TvButton(
              label: 'Reintentar',
              icon: Icons.refresh,
              style: TvButtonStyle.outline,
              height: context.s(48),
              onPressed: _load,
            ),
          ],
        ),
      );
    }
    if (rows.isEmpty) return const EmptyState(message: 'Sin platillos');
    return ListView.builder(
      padding: EdgeInsets.all(context.s(8)),
      itemCount: rows.length,
      itemBuilder: (_, i) => _row(context, rows[i]),
    );
  }

  Widget _head(BuildContext context, String text, int flex,
      {TextAlign align = TextAlign.left}) {
    return Expanded(
      flex: flex,
      child: Text(text,
          textAlign: align,
          style: TextStyle(
              fontSize: context.s(12),
              letterSpacing: 0.8,
              color: AppColors.textMuted,
              fontWeight: FontWeight.w800)),
    );
  }

  Widget _header(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: context.s(28), vertical: context.s(16)),
      decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.border))),
      child: Row(
        children: [
          _head(context, 'PLATILLO', 3),
          _head(context, 'CATEGORÍA', 2),
          _head(context, 'DISPONIBILIDAD', 2),
          _head(context, 'ACCIÓN', 2, align: TextAlign.right),
        ],
      ),
    );
  }

  Widget _row(BuildContext context, _MenuDish d) {
    final on = d.available;
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: context.s(20), vertical: context.s(10)),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(d.name,
                style: TextStyle(
                    fontSize: context.s(17),
                    fontWeight: FontWeight.w700,
                    color: on ? Colors.white : AppColors.textMuted)),
          ),
          Expanded(
            flex: 2,
            child: Text(d.category,
                style: TextStyle(
                    fontSize: context.s(16), color: AppColors.textMuted)),
          ),
          Expanded(
            flex: 2,
            child: Row(
              children: [
                Icon(on ? Icons.check_circle : Icons.cancel,
                    size: context.s(20),
                    color: on ? Colors.white : AppColors.redLight),
                SizedBox(width: context.s(8)),
                Text(on ? 'Disponible' : 'No disponible',
                    style: TextStyle(
                        fontSize: context.s(15),
                        fontWeight: FontWeight.w600,
                        color: on ? Colors.white : AppColors.redLight)),
              ],
            ),
          ),
          Expanded(
            flex: 2,
            child: Align(
              alignment: Alignment.centerRight,
              child: TvButton(
                label: on ? 'Deshabilitar' : 'Habilitar',
                icon: on ? Icons.block : Icons.check,
                style: on ? TvButtonStyle.danger : TvButtonStyle.primary,
                height: context.s(46),
                onPressed: () => _toggle(d),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
