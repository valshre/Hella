import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/recipe_modal.dart';
import '../widgets/tv_widgets.dart';

class _Recipe {
  const _Recipe(this.title, this.category, this.subtitle);
  final String title;
  final String category;
  final String subtitle;
}

class RecetasScreen extends StatefulWidget {
  const RecetasScreen({super.key});

  @override
  State<RecetasScreen> createState() => _RecetasScreenState();
}

class _RecetasScreenState extends State<RecetasScreen> {
  static const _all = 'Todas las categorías';

  static const _recipes = [
    _Recipe('Pasta Alfredo', 'Pastas', '4 ingredientes · 4 pasos'),
    _Recipe('Ensalada César', 'Ensaladas', '5 ingredientes · 4 pasos'),
    _Recipe('Sopa del día', 'Entradas', '3 ingredientes · 4 pasos'),
    _Recipe('Risotto de hongos', 'Arroces', '5 ingredientes · 4 pasos'),
    _Recipe(
        'Salmón a la parrilla', 'Platos fuertes', '4 ingredientes · 4 pasos'),
    _Recipe('Pollo al romero', 'Platos fuertes', '4 ingredientes · 4 pasos'),
  ];

  String _category = _all;
  String _query = '';

  List<String> get _categories =>
      [_all, ..._recipes.map((r) => r.category).toSet()];

  List<_Recipe> get _visible {
    final q = _query.trim().toLowerCase();
    return _recipes.where((r) {
      if (_category != _all && r.category != _category) return false;
      return q.isEmpty || r.title.toLowerCase().contains(q);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final items = _visible;
    return Padding(
      padding: EdgeInsets.all(context.s(28)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ScreenHeader(
            title: 'Recetas',
            subtitle: 'Consulta las fichas técnicas de cada platillo.',
          ),
          SizedBox(height: context.s(20)),
          Row(
            children: [
              Expanded(
                child: TvTextField(
                  hint: 'Nombre del platillo...',
                  icon: Icons.search,
                  onChanged: (v) => setState(() => _query = v),
                ),
              ),
              SizedBox(width: context.s(16)),
              TvDropdown(
                value: _category,
                items: _categories,
                onChanged: (v) => setState(() => _category = v),
              ),
            ],
          ),
          SizedBox(height: context.s(24)),
          Expanded(
            child: items.isEmpty
                ? const EmptyState(message: 'No se encontraron recetas')
                : GridView.builder(
                    padding: EdgeInsets.all(context.s(4)),
                    gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: context.s(420),
                      mainAxisExtent: context.s(118),
                      crossAxisSpacing: context.s(18),
                      mainAxisSpacing: context.s(18),
                    ),
                    itemCount: items.length,
                    itemBuilder: (_, i) => _card(context, items[i]),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _card(BuildContext context, _Recipe r) {
    return TvFocusable(
      radius: context.s(14),
      onTap: () =>
          showDialog(context: context, builder: (_) => const RecipeModal()),
      builder: (_, focused) => AnimatedContainer(
        duration: const Duration(milliseconds: 140),
        padding: EdgeInsets.all(context.s(18)),
        decoration: BoxDecoration(
          color: focused ? AppColors.surfaceHigh : AppColors.surface,
          borderRadius: BorderRadius.circular(context.s(14)),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Container(
              width: context.s(56),
              height: context.s(56),
              decoration: BoxDecoration(
                color: AppColors.redSoft,
                borderRadius: BorderRadius.circular(context.s(12)),
              ),
              child: Icon(Icons.restaurant_menu,
                  color: AppColors.redLight, size: context.s(28)),
            ),
            SizedBox(width: context.s(16)),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(r.category.toUpperCase(),
                      style: TextStyle(
                          fontSize: context.s(11),
                          letterSpacing: 0.8,
                          fontWeight: FontWeight.w800,
                          color: AppColors.redLight)),
                  SizedBox(height: context.s(4)),
                  Text(r.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          fontSize: context.s(19),
                          fontWeight: FontWeight.w800,
                          color: Colors.white)),
                  SizedBox(height: context.s(4)),
                  Text(r.subtitle,
                      style: TextStyle(
                          fontSize: context.s(14), color: AppColors.textMuted)),
                ],
              ),
            ),
            Icon(Icons.chevron_right,
                color: AppColors.textMuted, size: context.s(28)),
          ],
        ),
      ),
    );
  }
}
