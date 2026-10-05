import 'dart:async';
import 'package:flutter/material.dart';
import '../services/settings_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/recipe_modal.dart';
import '../widgets/tv_widgets.dart';

enum OrderStatus { pendiente, preparacion, listo }

class _Dish {
  const _Dish(this.qty, this.name, {this.hasRecipe = true});
  final int qty;
  final String name;
  final bool hasRecipe;
}

class _Order {
  _Order({
    required this.id,
    required this.received,
    required this.client,
    required this.zone,
    required this.guests,
    required this.priority,
    required this.dishes,
    this.note,
    this.status = OrderStatus.pendiente,
  });

  final String id;
  final String received;
  final String client;
  final String zone;
  final int guests;
  final Priority priority;
  final List<_Dish> dishes;
  final String? note;
  OrderStatus status;
}

class ComandasScreen extends StatefulWidget {
  const ComandasScreen({super.key});

  @override
  State<ComandasScreen> createState() => _ComandasScreenState();
}

class _ComandasScreenState extends State<ComandasScreen> {
  final List<_Order> _orders = [
    _Order(
      id: '#1042',
      received: '12:35',
      client: 'Laura Méndez',
      zone: 'Juriquilla · Calle Mirador 12',
      guests: 4,
      priority: Priority.alta,
      dishes: const [
        _Dish(2, 'Pasta Alfredo'),
        _Dish(1, 'Ensalada César'),
        _Dish(3, 'Agua mineral', hasRecipe: false),
      ],
      note: 'Cliente alérgico a nueces.\nServir la pasta sin gluten.',
    ),
    _Order(
      id: '#1043',
      received: '12:38',
      client: 'Andrés Torres',
      zone: 'Centro Sur · Av. Universidad 340',
      guests: 2,
      priority: Priority.urgente,
      dishes: const [
        _Dish(1, 'Salmón a la parrilla'),
        _Dish(2, 'Risotto de hongos'),
      ],
      note: 'Cliente con prisa: el chef debe salir en 20 min.',
    ),
    _Order(
      id: '#1044',
      received: '12:40',
      client: 'Familia Ruiz',
      zone: 'El Refugio · Calle Roble 8',
      guests: 6,
      priority: Priority.normal,
      dishes: const [
        _Dish(4, 'Pollo al romero'),
        _Dish(2, 'Sopa del día'),
      ],
      status: OrderStatus.preparacion,
    ),
  ];

  OrderStatus? _filter; // null = todos
  String _query = '';
  String? _toast;
  Timer? _toastTimer;

  @override
  void dispose() {
    _toastTimer?.cancel();
    super.dispose();
  }

  List<_Order> get _visible {
    final q = _query.trim().toLowerCase();
    return _orders.where((o) {
      if (_filter != null && o.status != _filter) return false;
      if (q.isEmpty) return true;
      return o.id.toLowerCase().contains(q) ||
          o.client.toLowerCase().contains(q) ||
          o.zone.toLowerCase().contains(q) ||
          o.dishes.any((d) => d.name.toLowerCase().contains(q));
    }).toList();
  }

  int _count(OrderStatus? s) =>
      s == null ? _orders.length : _orders.where((o) => o.status == s).length;

  void _advance(_Order o) {
    setState(() {
      if (o.status == OrderStatus.pendiente) {
        o.status = OrderStatus.preparacion;
        _showToast('Pedido ${o.id} en preparación.');
      } else if (o.status == OrderStatus.preparacion) {
        o.status = OrderStatus.listo;
        _showToast('Pedido ${o.id} listo para salir.');
      }
    });
  }

  void _showToast(String message) {
    _toastTimer?.cancel();
    _toast = message;
    _toastTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) setState(() => _toast = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    final visible = _visible;
    final kitchenNotes = SettingsScope.of(context).notes.trim();
    return Stack(
      children: [
        Padding(
          padding: EdgeInsets.all(context.s(28)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TvTextField(
                hint: 'Buscar pedido, cliente o platillo...',
                icon: Icons.search,
                onChanged: (v) => setState(() => _query = v),
              ),
              SizedBox(height: context.s(16)),
              Wrap(
                spacing: context.s(10),
                runSpacing: context.s(10),
                children: [
                  _chip('Todos', null),
                  _chip('Pendientes', OrderStatus.pendiente),
                  _chip('En preparación', OrderStatus.preparacion),
                  _chip('Listos', OrderStatus.listo),
                ],
              ),
              if (kitchenNotes.isNotEmpty) ...[
                SizedBox(height: context.s(16)),
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.symmetric(
                      horizontal: context.s(16), vertical: context.s(10)),
                  decoration: BoxDecoration(
                    color: AppColors.redSoft,
                    borderRadius: BorderRadius.circular(context.s(10)),
                    border:
                        Border.all(color: AppColors.red.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.sticky_note_2_outlined,
                          size: context.s(20), color: AppColors.redLight),
                      SizedBox(width: context.s(10)),
                      Expanded(
                        child: Text(kitchenNotes,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                                fontSize: context.s(14), color: Colors.white)),
                      ),
                    ],
                  ),
                ),
              ],
              SizedBox(height: context.s(20)),
              Expanded(
                child: visible.isEmpty
                    ? const EmptyState(message: 'No hay pedidos para mostrar')
                    : ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: visible.length,
                        separatorBuilder: (_, __) =>
                            SizedBox(width: context.s(18)),
                        itemBuilder: (_, i) => _OrderCard(
                          order: visible[i],
                          onAdvance: () => _advance(visible[i]),
                        ),
                      ),
              ),
            ],
          ),
        ),
        Positioned(
          bottom: context.s(24),
          right: context.s(24),
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 220),
            transitionBuilder: (child, anim) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position:
                    Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero)
                        .animate(anim),
                child: child,
              ),
            ),
            child: _toast == null
                ? const SizedBox.shrink(key: ValueKey('none'))
                : _Toast(
                    key: ValueKey(_toast),
                    message: _toast!,
                    onClose: () => setState(() => _toast = null),
                  ),
          ),
        ),
      ],
    );
  }

  Widget _chip(String label, OrderStatus? status) => TvChip(
        label: label,
        count: _count(status),
        selected: _filter == status,
        onTap: () => setState(() => _filter = status),
      );
}

// ─────────────────────────────────────────────────────────────
// Tarjeta de pedido
// El borde se resalta cuando cualquiera de sus botones tiene foco.
// ─────────────────────────────────────────────────────────────
class _OrderCard extends StatelessWidget {
  const _OrderCard({required this.order, required this.onAdvance});

  final _Order order;
  final VoidCallback onAdvance;

  @override
  Widget build(BuildContext context) {
    final o = order;
    final urgent = o.priority == Priority.urgente;

    String actionLabel;
    IconData actionIcon;
    TvButtonStyle actionStyle;
    VoidCallback? actionCb;
    switch (o.status) {
      case OrderStatus.pendiente:
        actionLabel = 'Comenzar';
        actionIcon = Icons.play_arrow_rounded;
        actionStyle = TvButtonStyle.primary;
        actionCb = onAdvance;
        break;
      case OrderStatus.preparacion:
        actionLabel = 'Marcar listo';
        actionIcon = Icons.check_rounded;
        actionStyle = TvButtonStyle.light;
        actionCb = onAdvance;
        break;
      case OrderStatus.listo:
        actionLabel = 'Listo para salir';
        actionIcon = Icons.check_circle_outline;
        actionStyle = TvButtonStyle.outline;
        actionCb = null;
        break;
    }

    return Focus(
      canRequestFocus: false,
      skipTraversal: true,
      child: Builder(builder: (ctx) {
        final within = Focus.of(ctx).hasFocus;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          width: context.s(350),
          padding: EdgeInsets.all(context.s(18)),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(context.s(16)),
            border: Border.all(
              color: within
                  ? Colors.white
                  : (urgent ? AppColors.red : AppColors.border),
              width: within ? 3 : (urgent ? 2 : 1.2),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(o.id,
                      style: TextStyle(
                          fontSize: context.s(26),
                          fontWeight: FontWeight.w800,
                          color: Colors.white)),
                  PriorityBadge(priority: o.priority),
                ],
              ),
              SizedBox(height: context.s(6)),
              _StatusLine(status: o.status),
              SizedBox(height: context.s(12)),
              Expanded(
                child: ListView(
                  children: [
                    _meta(context, Icons.person_outline, o.client,
                        strong: true),
                    _meta(context, Icons.location_on_outlined, o.zone),
                    _meta(context, Icons.groups_outlined,
                        '${o.guests} comensales'),
                    _meta(context, Icons.schedule, 'Recibido ${o.received}'),
                    Divider(color: AppColors.border, height: context.s(26)),
                    for (final d in o.dishes) _dishRow(context, d),
                    if (o.note != null) _note(context, o.note!),
                  ],
                ),
              ),
              SizedBox(height: context.s(12)),
              TvButton(
                label: actionLabel,
                icon: actionIcon,
                style: actionStyle,
                expand: true,
                height: context.s(54),
                fontSize: context.s(16),
                onPressed: actionCb,
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _meta(BuildContext context, IconData icon, String text,
      {bool strong = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: context.s(6)),
      child: Row(
        children: [
          Icon(icon, size: context.s(18), color: AppColors.textMuted),
          SizedBox(width: context.s(8)),
          Expanded(
            child: Text(text,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    fontSize: context.s(14),
                    fontWeight: strong ? FontWeight.w700 : FontWeight.w400,
                    color: strong ? Colors.white : AppColors.textMuted)),
          ),
        ],
      ),
    );
  }

  Widget _dishRow(BuildContext context, _Dish d) {
    return Container(
      margin: EdgeInsets.only(bottom: context.s(8)),
      padding: EdgeInsets.symmetric(
          horizontal: context.s(12), vertical: context.s(8)),
      decoration: BoxDecoration(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(context.s(10)),
      ),
      child: Row(
        children: [
          Text('${d.qty}×',
              style: TextStyle(
                  fontSize: context.s(16),
                  fontWeight: FontWeight.w800,
                  color: AppColors.redLight)),
          SizedBox(width: context.s(10)),
          Expanded(
            child: Text(d.name,
                style: TextStyle(fontSize: context.s(15), color: Colors.white)),
          ),
          if (d.hasRecipe)
            TvButton(
              label: 'Receta',
              icon: Icons.menu_book,
              style: TvButtonStyle.outline,
              height: context.s(38),
              fontSize: context.s(13),
              onPressed: () => showDialog(
                context: context,
                builder: (_) => const RecipeModal(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _note(BuildContext context, String text) {
    return Container(
      margin: EdgeInsets.only(top: context.s(4)),
      padding: EdgeInsets.all(context.s(12)),
      decoration: BoxDecoration(
        color: AppColors.redSoft,
        borderRadius: BorderRadius.circular(context.s(10)),
        border: Border.all(color: AppColors.red.withValues(alpha: 0.6)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.warning_amber_rounded,
              size: context.s(20), color: AppColors.redLight),
          SizedBox(width: context.s(10)),
          Expanded(
            child: Text(text,
                style: TextStyle(
                    fontSize: context.s(14),
                    height: 1.35,
                    fontWeight: FontWeight.w600,
                    color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _StatusLine extends StatelessWidget {
  const _StatusLine({required this.status});
  final OrderStatus status;

  @override
  Widget build(BuildContext context) {
    String text;
    Color dot;
    switch (status) {
      case OrderStatus.pendiente:
        text = 'Pendiente';
        dot = AppColors.textMuted;
        break;
      case OrderStatus.preparacion:
        text = 'En preparación';
        dot = AppColors.red;
        break;
      case OrderStatus.listo:
        text = 'Listo';
        dot = Colors.white;
        break;
    }
    return Row(
      children: [
        Container(
          width: context.s(9),
          height: context.s(9),
          decoration: BoxDecoration(color: dot, shape: BoxShape.circle),
        ),
        SizedBox(width: context.s(8)),
        Text(text,
            style: TextStyle(
                fontSize: context.s(14),
                fontWeight: FontWeight.w600,
                color: Colors.white70)),
      ],
    );
  }
}

class _Toast extends StatelessWidget {
  const _Toast({super.key, required this.message, required this.onClose});
  final String message;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: context.s(18), vertical: context.s(12)),
      decoration: BoxDecoration(
        color: AppColors.surfaceHigh,
        borderRadius: BorderRadius.circular(context.s(12)),
        border: Border.all(color: AppColors.red, width: 1.6),
        boxShadow: const [BoxShadow(color: Colors.black54, blurRadius: 12)],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.notifications_active,
              color: AppColors.redLight, size: context.s(22)),
          SizedBox(width: context.s(12)),
          Text(message,
              style: TextStyle(color: Colors.white, fontSize: context.s(15))),
          SizedBox(width: context.s(14)),
          TvFocusable(
            onTap: onClose,
            radius: context.s(20),
            builder: (_, __) => Padding(
              padding: EdgeInsets.all(context.s(6)),
              child: Icon(Icons.close,
                  color: AppColors.textMuted, size: context.s(20)),
            ),
          ),
        ],
      ),
    );
  }
}
