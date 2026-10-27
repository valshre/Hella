import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../services/settings_controller.dart';
import '../theme/app_theme.dart';
import '../widgets/recipe_modal.dart';
import '../widgets/tv_widgets.dart';

const _baseUrl = 'https://hella-i3o7.onrender.com/sdk';
// Render (plan gratis) duerme el server: la 1ª petición puede tardar ~50 s.
const _timeout = Duration(seconds: 60);

class _ApiError implements Exception {
  _ApiError(this.message, [this.status]);
  final String message;
  final int? status;
  @override
  String toString() => message;
}

enum OrderStatus { pendiente, preparacion, listo }

OrderStatus _parseStatus(String? v) {
  final s = (v ?? '').toLowerCase();
  if (s.contains('prepar')) return OrderStatus.preparacion;
  if (s.contains('listo')) return OrderStatus.listo;
  return OrderStatus.pendiente; // 'Pendiente' o cualquier otro
}

// Valores que espera tu PATCH /kds/pedidos/:id/estado
String _statusToApi(OrderStatus s) {
  switch (s) {
    case OrderStatus.pendiente:
      return 'Pendiente';
    case OrderStatus.preparacion:
      return 'En preparación';
    case OrderStatus.listo:
      return 'Listo';
  }
}

Priority _parsePriority(String? v) {
  switch ((v ?? '').toLowerCase()) {
    case 'urgente':
      return Priority.urgente;
    case 'alta':
      return Priority.alta;
    default:
      return Priority.normal;
  }
}

class _Dish {
  const _Dish(this.platilloId, this.qty, this.name, {this.hasRecipe = true});
  final int platilloId;
  final int qty;
  final String name;
  final bool hasRecipe;

  factory _Dish.fromJson(Map<String, dynamic> j) => _Dish(
        (j['platillo_id'] as num).toInt(),
        (j['cantidad'] as num?)?.toInt() ?? 1,
        '${j['platillo_nombre'] ?? ''}',
        // Si agregas 'tiene_receta' en el SQL (ver notas) se usa; si no, true.
        hasRecipe: j['tiene_receta'] as bool? ?? true,
      );
}

class _Order {
  _Order({
    required this.dbId,
    required this.received,
    required this.client,
    required this.zone,
    required this.guests,
    required this.priority,
    required this.dishes,
    this.note,
    this.status = OrderStatus.pendiente,
  });

  final int dbId;
  String get id => '#$dbId';
  final String received;
  final String client;
  final String zone;
  final int guests;
  final Priority priority;
  final List<_Dish> dishes;
  final String? note;
  OrderStatus status;

  factory _Order.fromJson(Map<String, dynamic> j) {
    final dt = DateTime.tryParse('${j['hora_recepcion']}')?.toLocal();
    final hhmm = dt == null
        ? '--:--'
        : '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    final nota = (j['notas_especiales'] as String?)?.trim();
    // LEFT JOIN: sin detalle llega [{platillo_id: null, ...}] -> se descarta.
    final platillos = ((j['platillos'] as List?) ?? [])
        .cast<Map<String, dynamic>>()
        .where((d) => d['platillo_id'] != null)
        .map(_Dish.fromJson)
        .toList();
    return _Order(
      dbId: (j['pedido_id'] as num).toInt(),
      received: hhmm,
      client: '${j['cliente_nombre'] ?? ''}',
      zone: '${j['zona_domicilio'] ?? ''}',
      guests: (j['numero_comensales'] as num?)?.toInt() ?? 0,
      priority: _parsePriority(j['prioridad'] as String?),
      dishes: platillos,
      note: (nota == null || nota.isEmpty) ? null : nota,
      status: _parseStatus(j['estado'] as String?),
    );
  }
}

class ComandasScreen extends StatefulWidget {
  const ComandasScreen({super.key});

  @override
  State<ComandasScreen> createState() => _ComandasScreenState();
}

class _ComandasScreenState extends State<ComandasScreen> {
  static const _pollEvery = Duration(seconds: 15);

  // TODO: conecta con donde ya guardas el token del login
  // (Provider, SharedPreferences, tu AuthController, etc.).
  String? get _token => null;

  List<_Order> _orders = [];
  final Set<int> _busy = {}; // pedidos con un PATCH en curso

  bool _loading = true;
  String? _error; // error de la carga inicial
  bool _offline = false; // falló un refresco silencioso

  OrderStatus? _filter; // null = todos
  String _query = '';
  String? _toast;
  Timer? _toastTimer;
  Timer? _pollTimer;

  @override
  void initState() {
    super.initState();
    _load();
    _pollTimer = Timer.periodic(_pollEvery, (_) => _load(silent: true));
  }

  @override
  void dispose() {
    _toastTimer?.cancel();
    _pollTimer?.cancel();
    super.dispose();
  }

  // ── HTTP ────────────────────────────────────────────────
  Future<dynamic> _request(String method, String path,
      {Map<String, dynamic>? body}) async {
    final uri = Uri.parse('$_baseUrl$path');
    final headers = {
      'Content-Type': 'application/json',
      if (_token != null) 'Authorization': 'Bearer $_token',
    };
    try {
      final r = method == 'GET'
          ? await http.get(uri, headers: headers).timeout(_timeout)
          : await http
              .patch(uri, headers: headers, body: jsonEncode(body))
              .timeout(_timeout);
      dynamic data;
      try {
        data = r.body.isEmpty ? null : jsonDecode(r.body);
      } catch (_) {}
      if (r.statusCode >= 200 && r.statusCode < 300) return data;
      if (r.statusCode == 401) {
        _goLogin();
        throw _ApiError('Sesión expirada', 401);
      }
      throw _ApiError(
          data is Map && data['error'] != null
              ? '${data['error']}'
              : 'Error ${r.statusCode}',
          r.statusCode);
    } on _ApiError {
      rethrow;
    } on TimeoutException {
      throw _ApiError('El servidor tardó demasiado en responder.');
    } catch (_) {
      throw _ApiError('Sin conexión con el servidor.');
    }
  }

  void _goLogin() {
    if (!mounted) return;
    // Ajusta al nombre de tu ruta de login.
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (_) => false);
  }

  // ── Datos ───────────────────────────────────────────────
  Future<void> _load({bool silent = false}) async {
    // No pisar un cambio optimista que aún no confirma el servidor.
    if (silent && _busy.isNotEmpty) return;
    if (!silent)
      setState(() {
        _loading = true;
        _error = null;
      });
    try {
      final data = await _request('GET', '/kds/pedidos') as List;
      if (!mounted) return;
      setState(() {
        _orders =
            data.cast<Map<String, dynamic>>().map(_Order.fromJson).toList();
        _loading = false;
        _error = null;
        _offline = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        if (_orders.isEmpty && !silent) _error = '$e';
      });
      if (silent && !_offline) {
        _offline = true;
        _showToast('Sin conexión. Reintentando…');
      }
    }
  }

  Future<void> _advance(_Order o) async {
    if (_busy.contains(o.dbId)) return;
    final prev = o.status;
    final OrderStatus? next = prev == OrderStatus.pendiente
        ? OrderStatus.preparacion
        : prev == OrderStatus.preparacion
            ? OrderStatus.listo
            : null;
    if (next == null) return;

    _busy.add(o.dbId);
    setState(() => o.status = next); // optimista
    try {
      await _request('PATCH', '/kds/pedidos/${o.dbId}/estado',
          body: {'estado': _statusToApi(next)});
      _showToast(next == OrderStatus.preparacion
          ? 'Pedido ${o.id} en preparación.'
          : 'Pedido ${o.id} listo para salir.');
    } catch (_) {
      if (mounted) setState(() => o.status = prev); // rollback
      _showToast('No se pudo actualizar ${o.id}. Intenta de nuevo.');
    } finally {
      _busy.remove(o.dbId);
    }
  }

  Future<void> _openRecipe(_Dish d) async {
    try {
      final data = await _request('GET', '/kds/receta/${d.platilloId}');
      if (!mounted) return;
      showDialog(
        context: context,
        builder: (_) => RecipeModal(receta: data as Map<String, dynamic>),
      );
    } on _ApiError catch (e) {
      _showToast(e.status == 404
          ? '${d.name} no tiene receta registrada.'
          : 'No se pudo cargar la receta.');
    }
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

  void _showToast(String message) {
    if (!mounted) return;
    _toastTimer?.cancel();
    setState(() => _toast = message);
    _toastTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) setState(() => _toast = null);
    });
  }

  Widget _body(List<_Order> visible) {
    if (_loading) {
      return const Center(
          child: CircularProgressIndicator(color: Colors.white));
    }
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_error!,
                style: TextStyle(color: Colors.white, fontSize: context.s(18))),
            SizedBox(height: context.s(16)),
            TvButton(
              label: 'Reintentar',
              icon: Icons.refresh,
              style: TvButtonStyle.primary,
              height: context.s(54),
              fontSize: context.s(16),
              onPressed: _load,
            ),
          ],
        ),
      );
    }
    if (visible.isEmpty) {
      return const EmptyState(message: 'No hay pedidos para mostrar');
    }
    return ListView.separated(
      scrollDirection: Axis.horizontal,
      itemCount: visible.length,
      separatorBuilder: (_, __) => SizedBox(width: context.s(18)),
      itemBuilder: (_, i) => _OrderCard(
        // La key conserva el foco del control remoto cuando llegan datos nuevos.
        key: ValueKey(visible[i].dbId),
        order: visible[i],
        onAdvance: () => _advance(visible[i]),
        onRecipe: _openRecipe,
      ),
    );
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
              Expanded(child: _body(visible)),
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
// Tarjeta de pedido (sin cambios de UI, solo recibe key)
// ─────────────────────────────────────────────────────────────
class _OrderCard extends StatelessWidget {
  const _OrderCard({
    super.key,
    required this.order,
    required this.onAdvance,
    required this.onRecipe,
  });

  final _Order order;
  final VoidCallback onAdvance;
  final void Function(_Dish) onRecipe;

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
              onPressed: () => onRecipe(d),
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
