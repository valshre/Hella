import 'dart:async';
import 'package:flutter/material.dart';
import '../screens/ajustes_screen.dart';
import '../screens/comandas_screen.dart';
import '../screens/historial_screen.dart';
import '../screens/menu_screen.dart';
import '../screens/recetas_screen.dart';
import '../services/settings_controller.dart';
import '../theme/app_theme.dart';
import 'tv_widgets.dart';

class _NavItem {
  const _NavItem(this.label, this.icon, this.activeIcon);
  final String label;
  final IconData icon;
  final IconData activeIcon;
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  static const _items = [
    _NavItem('Comandas', Icons.receipt_long_outlined, Icons.receipt_long),
    _NavItem('Menú', Icons.restaurant_menu_outlined, Icons.restaurant_menu),
    _NavItem('Recetas', Icons.menu_book_outlined, Icons.menu_book),
    _NavItem('Historial', Icons.history, Icons.history_toggle_off),
    _NavItem('Ajustes', Icons.settings_outlined, Icons.settings),
  ];

  final List<Widget> _screens = const [
    ComandasScreen(),
    MenuScreen(),
    RecetasScreen(),
    HistorialScreen(),
    AjustesScreen(),
  ];

  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            _TopBar(
              items: _items,
              selected: _index,
              onSelect: (i) => setState(() => _index = i),
            ),
            Expanded(
              // IndexedStack conserva el estado de cada pantalla al cambiar de pestaña.
              child: IndexedStack(
                index: _index,
                children: [
                  for (var i = 0; i < _screens.length; i++)
                    ExcludeFocus(
                      excluding: i != _index,
                      child: _screens[i],
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

class _TopBar extends StatelessWidget {
  const _TopBar(
      {required this.items, required this.selected, required this.onSelect});

  final List<_NavItem> items;
  final int selected;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: context.s(88),
      padding: EdgeInsets.symmetric(horizontal: context.s(28)),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.red, width: 2)),
        boxShadow: [BoxShadow(color: Color(0x66000000), blurRadius: 14)],
      ),
      child: Row(
        children: [
          const _Brand(),
          SizedBox(width: context.s(24)),
          // Las pestañas se reducen solas si el espacio no alcanza,
          // así nunca se encima nada con la marca ni con el reloj.
          Expanded(
            child: Center(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    for (var i = 0; i < items.length; i++) ...[
                      if (i > 0) SizedBox(width: context.s(8)),
                      _NavTab(
                        item: items[i],
                        selected: i == selected,
                        onTap: () => onSelect(i),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          SizedBox(width: context.s(24)),
          const _Clock(),
        ],
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) {
    final station = SettingsScope.of(context).stationName;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: context.s(50),
          height: context.s(50),
          decoration: BoxDecoration(
            color: AppColors.red,
            borderRadius: BorderRadius.circular(context.s(14)),
            boxShadow: const [
              BoxShadow(color: Color(0x59D62828), blurRadius: 14),
            ],
          ),
          child:
              Icon(Icons.restaurant, color: Colors.white, size: context.s(28)),
        ),
        SizedBox(width: context.s(14)),
        ConstrainedBox(
          constraints: BoxConstraints(maxWidth: context.s(220)),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(station,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                      fontSize: context.s(19),
                      fontWeight: FontWeight.w800,
                      color: Colors.white)),
              Text('Chefs a domicilio',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                      fontSize: context.s(12),
                      letterSpacing: 0.4,
                      color: AppColors.textMuted)),
            ],
          ),
        ),
      ],
    );
  }
}

class _NavTab extends StatelessWidget {
  const _NavTab(
      {required this.item, required this.selected, required this.onTap});

  final _NavItem item;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return TvFocusable(
      radius: context.s(14),
      onTap: onTap,
      builder: (_, __) => AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        height: context.s(52),
        padding: EdgeInsets.symmetric(horizontal: context.s(20)),
        decoration: BoxDecoration(
          color: selected ? AppColors.red : Colors.transparent,
          borderRadius: BorderRadius.circular(context.s(14)),
          boxShadow: selected
              ? const [BoxShadow(color: Color(0x59D62828), blurRadius: 14)]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(selected ? item.activeIcon : item.icon,
                size: context.s(24),
                color: selected ? Colors.white : AppColors.textMuted),
            SizedBox(width: context.s(10)),
            Text(item.label,
                style: TextStyle(
                    fontSize: context.s(16),
                    fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
                    color: selected ? Colors.white : AppColors.textMuted)),
          ],
        ),
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
  late DateTime _now = DateTime.now();
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 20), (_) {
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
    final hh = _now.hour.toString().padLeft(2, '0');
    final mm = _now.minute.toString().padLeft(2, '0');
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: context.s(16), vertical: context.s(10)),
      decoration: BoxDecoration(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(context.s(12)),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.schedule, size: context.s(20), color: AppColors.redLight),
          SizedBox(width: context.s(8)),
          Text('$hh:$mm',
              style: TextStyle(
                  fontSize: context.s(20),
                  fontWeight: FontWeight.w800,
                  color: Colors.white)),
        ],
      ),
    );
  }
}
