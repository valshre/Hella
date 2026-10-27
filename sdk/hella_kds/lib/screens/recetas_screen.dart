import 'package:flutter/material.dart';
import '../services/hella_api.dart';
import '../theme/app_theme.dart';
import '../widgets/recipe_modal.dart';
import '../widgets/tv_widgets.dart';

class _Recipe {
  const _Recipe(this.id, this.title, this.category, this.subtitle);
  final int id;
  final String title;
  final String category;
  final String subtitle;

  factory _Recipe.fromJson(Map<String, dynamic> j) => _Recipe(
        (j['id'] as num).toInt(),
        '${j['nombre']}',
        '${j['categoria_nombre'] ?? 'Sin categoría'}',
        '${j['descripcion'] ?? 'Ver ficha técnica'}',
      );
}

class RecetasScreen extends StatefulWidget {
  const RecetasScreen({super.key});

  @override
  State<RecetasScreen> createState() => _RecetasScreenState();
}

class _RecetasScreenState extends State<RecetasScreen> {
  static const _all = 'Todas las categorías';

  List<_Recipe> _recipes = [];
  bool _loading = true;
  String? _error;

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
        _recipes = data.map(_Recipe.fromJson).toList();
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

  Future<void> _open(_Recipe r) async {
    try {
      final receta = await HellaApi.kdsReceta(r.id);
      if (!mounted) return;
      showDialog(context: context, builder: (_) => RecipeModal(receta: receta));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.maybeOf(context)?.showSnackBar(SnackBar(
        backgroundColor: AppColors.surfaceHigh,
        behavior: SnackBarBehavior.floating,
        content: Text('$e',
            style: TextStyle(color: Colors.white, fontSize: context.s(15))),
      ));
    }
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
                value: _categories.contains(_category) ? _category : _all,
                items: _categories,
                onChanged: (v) => setState(() => _category = v),
              ),
            ],
          ),
          SizedBox(height: context.s(24)),
          Expanded(child: _content(context, items)),
        ],
      ),
    );
  }

  Widget _content(BuildContext context, List<_Recipe> items) {
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
    if (items.isEmpty) {
      return const EmptyState(message: 'No se encontraron recetas');
    }
    return GridView.builder(
      padding: EdgeInsets.all(context.s(4)),
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: context.s(420),
        mainAxisExtent: context.s(118),
        crossAxisSpacing: context.s(18),
        mainAxisSpacing: context.s(18),
      ),
      itemCount: items.length,
      itemBuilder: (_, i) => _card(context, items[i]),
    );
  }

  Widget _card(BuildContext context, _Recipe r) {
    return TvFocusable(
      radius: context.s(14),
      onTap: () => _open(r),
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
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
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
