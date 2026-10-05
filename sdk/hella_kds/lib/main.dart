import 'dart:async';
import 'package:flutter/material.dart';
import 'screens/ajustes_screen.dart';
import 'screens/comandas_screen.dart';
import 'screens/historial_screen.dart';
import 'screens/menu_screen.dart';
import 'screens/recetas_screen.dart';
import 'services/settings_controller.dart';
import 'theme/app_theme.dart';
import 'widgets/tv_widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final settings = await SettingsController.load(); // ajustes guardados
  runApp(HellaKdsApp(settings: settings));
}

class HellaKdsApp extends StatelessWidget {
  const HellaKdsApp({super.key, required this.settings});
  final SettingsController settings;

  @override
  Widget build(BuildContext context) {
    // SettingsScope va por ENCIMA de MaterialApp: toda la app (incluidos
    // diálogos como RecipeModal) reacciona a los ajustes guardados.
    return SettingsScope(
      controller: settings,
      child: MaterialApp(
        title: 'HELLA KDS',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        home: const MainLayout(),
      ),
    );
  }
}

class _NavItem {
  const _NavItem(this.label, this.icon, this.activeIcon);
  final String label;
  final IconData icon;
  final IconData activeIcon;
}

class MainLayout extends StatefulWidget {
  const MainLayout({super.key});

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  static const int _ajustesIndex = 4;

  // Mismo orden que tu menú original.
  static const _items = [
    _NavItem('Comandas', Icons.grid_view_outlined, Icons.grid_view_rounded),
    _NavItem('Recetas', Icons.menu_book_outlined, Icons.menu_book),
    _NavItem('Menú', Icons.restaurant_menu_outlined, Icons.restaurant_menu),
    _NavItem('Historial', Icons.history, Icons.history),
    _NavItem('Ajustes', Icons.settings_outlined, Icons.settings),
  ];

  final List<Widget> _screens = const [
    ComandasScreen(),
    RecetasScreen(),
    MenuScreen(),
    HistorialScreen(),
    AjustesScreen(),
  ];

  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _TopBar(
                onOpenSettings: () => setState(() {
                      _currentIndex = _ajustesIndex;
                    })),
            Expanded(
              child: Row(
                children: [
                  _Sidebar(
                    items: _items,
                    selected: _currentIndex,
                    onSelect: (i) => setState(() => _currentIndex = i),
                  ),
                  Expanded(
                    // IndexedStack conserva el estado de cada pantalla
                    // (p. ej. los pedidos ya avanzados) al cambiar de sección.
                    child: IndexedStack(
                      index: _currentIndex,
                      children: [
                        for (var i = 0; i < _screens.length; i++)
                          ExcludeFocus(
                            excluding: i != _currentIndex,
                            child: _screens[i],
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Barra superior
// ─────────────────────────────────────────────────────────────
class _TopBar extends StatelessWidget {
  const _TopBar({required this.onOpenSettings});
  final VoidCallback onOpenSettings;

  @override
  Widget build(BuildContext context) {
    final station = SettingsScope.of(context).stationName;
    return Container(
      height: context.s(72),
      padding: EdgeInsets.symmetric(horizontal: context.s(24)),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.red, width: 2)),
      ),
      child: Row(
        children: [
          Container(
            width: context.s(44),
            height: context.s(44),
            decoration: BoxDecoration(
              color: AppColors.red,
              borderRadius: BorderRadius.circular(context.s(12)),
              boxShadow: const [
                BoxShadow(color: Color(0x59D62828), blurRadius: 12),
              ],
            ),
            child: Icon(Icons.restaurant,
                color: Colors.white, size: context.s(26)),
          ),
          SizedBox(width: context.s(14)),
          Text('HELLA',
              style: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: context.s(24),
                  letterSpacing: 1.2,
                  color: Colors.white)),
          SizedBox(width: context.s(12)),
          Flexible(
            child: Text('KDS · $station',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    color: AppColors.textMuted, fontSize: context.s(16))),
          ),
          const Spacer(),
          // Estado de conexión (conéctalo a tu backend cuando exista).
          Container(
            padding: EdgeInsets.symmetric(
                horizontal: context.s(14), vertical: context.s(8)),
            decoration: BoxDecoration(
              color: AppColors.surfaceHigh,
              borderRadius: BorderRadius.circular(context.s(20)),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: context.s(9),
                  height: context.s(9),
                  decoration: const BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle),
                ),
                SizedBox(width: context.s(8)),
                Text('Conectado',
                    style: TextStyle(
                        fontSize: context.s(14),
                        fontWeight: FontWeight.w600,
                        color: Colors.white)),
              ],
            ),
          ),
          SizedBox(width: context.s(20)),
          const _Clock(),
          SizedBox(width: context.s(14)),
          TvFocusable(
            radius: context.s(12),
            onTap: onOpenSettings,
            builder: (_, __) => Padding(
              padding: EdgeInsets.all(context.s(10)),
              child: Icon(Icons.settings,
                  color: Colors.white70, size: context.s(26)),
            ),
          ),
        ],
      ),
    );
  }
}

class _Clock extends StatefulWidget {
  const _Clock();

  @override
  State<_Clock> createState() => _ClockState();
}

class _ClockState extends State<_Clock> {
  DateTime _now = DateTime.now();
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 15), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final h12 = _now.hour % 12 == 0 ? 12 : _now.hour % 12;
    final hh = h12.toString().padLeft(2, '0');
    final mm = _now.minute.toString().padLeft(2, '0');
    final suffix = _now.hour < 12 ? 'a.m.' : 'p.m.';
    return Text('$hh:$mm $suffix',
        style: TextStyle(
            fontSize: context.s(20),
            fontWeight: FontWeight.w800,
            color: Colors.white));
  }
}

// ─────────────────────────────────────────────────────────────
// Barra lateral (más ancha, con etiquetas legibles)
// ─────────────────────────────────────────────────────────────
class _Sidebar extends StatelessWidget {
  const _Sidebar(
      {required this.items, required this.selected, required this.onSelect});

  final List<_NavItem> items;
  final int selected;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: context.s(136),
      padding: EdgeInsets.all(context.s(12)),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(right: BorderSide(color: AppColors.border)),
      ),
      child: SingleChildScrollView(
        child: Column(
          children: [
            for (var i = 0; i < items.length; i++) ...[
              _SidebarItem(
                item: items[i],
                selected: i == selected,
                onTap: () => onSelect(i),
              ),
              SizedBox(height: context.s(10)),
            ],
          ],
        ),
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  const _SidebarItem(
      {required this.item, required this.selected, required this.onTap});

  final _NavItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return TvFocusable(
      radius: context.s(16),
      onTap: onTap,
      builder: (_, __) => AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        width: double.infinity,
        height: context.s(88),
        decoration: BoxDecoration(
          color: selected ? AppColors.red : Colors.transparent,
          borderRadius: BorderRadius.circular(context.s(16)),
          boxShadow: selected
              ? const [BoxShadow(color: Color(0x59D62828), blurRadius: 14)]
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(selected ? item.activeIcon : item.icon,
                size: context.s(32),
                color: selected ? Colors.white : AppColors.textMuted),
            SizedBox(height: context.s(6)),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(item.label,
                  style: TextStyle(
                      fontSize: context.s(14),
                      fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                      color: selected ? Colors.white : AppColors.textMuted)),
            ),
          ],
        ),
      ),
    );
  }
}
