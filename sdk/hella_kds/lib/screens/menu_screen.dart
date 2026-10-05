import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/tv_widgets.dart';

class _MenuDish {
  _MenuDish(this.name, this.category, {this.available = true});
  final String name;
  final String category;
  bool available;
}

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  static const _all = 'Todas las categorías';

  final List<_MenuDish> _dishes = [
    _MenuDish('Pasta Alfredo', 'Pastas'),
    _MenuDish('Ensalada César', 'Ensaladas'),
    _MenuDish('Sopa del día', 'Entradas'),
    _MenuDish('Risotto de hongos', 'Arroces'),
    _MenuDish('Salmón a la parrilla', 'Platos fuertes'),
    _MenuDish('Pollo al romero', 'Platos fuertes'),
  ];

  String _category = _all;

  List<String> get _categories =>
      [_all, ..._dishes.map((d) => d.category).toSet()];

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
              value: _category,
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
                  Expanded(
                    child: rows.isEmpty
                        ? const EmptyState(message: 'Sin platillos')
                        : ListView.builder(
                            padding: EdgeInsets.all(context.s(8)),
                            itemCount: rows.length,
                            itemBuilder: (_, i) => _row(context, rows[i]),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
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
                onPressed: () => setState(() => d.available = !d.available),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
