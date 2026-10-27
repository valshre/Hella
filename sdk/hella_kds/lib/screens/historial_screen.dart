import 'package:flutter/material.dart';
import '../services/hella_api.dart';
import '../theme/app_theme.dart';
import '../widgets/tv_widgets.dart';

class _Entry {
  const _Entry(this.id, this.client, this.zone, this.received, this.completed,
      this.dishes, this.priority);
  final String id;
  final String client;
  final String zone;
  final String received;
  final String completed;
  final int dishes;
  final Priority priority;

  factory _Entry.fromJson(Map<String, dynamic> j) => _Entry(
        '#${j['pedido_id']}',
        '${j['cliente_nombre'] ?? '-'}',
        '${j['zona_domicilio'] ?? '-'}',
        _hhmm(j['hora_recepcion']),
        _hhmm(j['hora_finalizacion']),
        (j['total_platillos'] as num?)?.toInt() ?? 0,
        Priority.values.firstWhere(
            (p) => p.name == '${j['prioridad']}'.toLowerCase(),
            orElse: () => Priority.normal),
      );

  static String _hhmm(dynamic v) {
    final d = DateTime.tryParse('$v')?.toLocal();
    if (d == null) return '-';
    return '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
  }
}

class HistorialScreen extends StatefulWidget {
  const HistorialScreen({super.key});

  @override
  State<HistorialScreen> createState() => _HistorialScreenState();
}

class _HistorialScreenState extends State<HistorialScreen> {
  List<_Entry> _entries = [];
  bool _loading = true;
  String? _error;

  Priority? _filter; // null = todas
  String _query = '';

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
      final data = await HellaApi.kdsHistorial();
      if (!mounted) return;
      setState(() {
        _entries = data.map(_Entry.fromJson).toList();
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

  List<_Entry> get _visible {
    final q = _query.trim().toLowerCase();
    return _entries.where((e) {
      if (_filter != null && e.priority != _filter) return false;
      if (q.isEmpty) return true;
      return e.id.toLowerCase().contains(q) ||
          e.client.toLowerCase().contains(q) ||
          e.zone.toLowerCase().contains(q);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final rows = _visible;
    return Padding(
      padding: EdgeInsets.all(context.s(28)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ScreenHeader(
            title: 'Historial',
            subtitle:
                '${_entries.length} pedidos completados en el servicio de hoy.',
          ),
          SizedBox(height: context.s(20)),
          TvTextField(
            hint: 'Buscar por pedido o cliente...',
            icon: Icons.search,
            onChanged: (v) => setState(() => _query = v),
          ),
          SizedBox(height: context.s(14)),
          Wrap(
            spacing: context.s(10),
            runSpacing: context.s(10),
            children: [
              _chip('Todas', null),
              _chip('Urgente', Priority.urgente),
              _chip('Alta', Priority.alta),
              _chip('Normal', Priority.normal),
            ],
          ),
          SizedBox(height: context.s(20)),
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

  Widget _content(BuildContext context, List<_Entry> rows) {
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
    if (rows.isEmpty) return const EmptyState(message: 'Sin resultados');
    return ListView.builder(
      padding: EdgeInsets.all(context.s(8)),
      itemCount: rows.length,
      itemBuilder: (_, i) => _row(context, rows[i]),
    );
  }

  Widget _chip(String label, Priority? p) => TvChip(
        label: label,
        selected: _filter == p,
        onTap: () => setState(() => _filter = p),
      );

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
          _head(context, 'PEDIDO', 2),
          _head(context, 'CLIENTE', 3),
          _head(context, 'RECIBIDO', 2),
          _head(context, 'COMPLETADO', 2),
          _head(context, 'PLATILLOS', 2),
          _head(context, 'PRIORIDAD', 3, align: TextAlign.right),
        ],
      ),
    );
  }

  Widget _row(BuildContext context, _Entry e) {
    final cell = TextStyle(fontSize: context.s(16), color: AppColors.textMuted);
    return TvFocusable(
      radius: context.s(10),
      scaleOnFocus: false,
      builder: (_, focused) => AnimatedContainer(
        duration: const Duration(milliseconds: 140),
        padding: EdgeInsets.symmetric(
            horizontal: context.s(20), vertical: context.s(16)),
        decoration: BoxDecoration(
          color: focused ? AppColors.surfaceHigh : Colors.transparent,
          borderRadius: BorderRadius.circular(context.s(10)),
        ),
        child: Row(
          children: [
            Expanded(
              flex: 2,
              child: Text(e.id,
                  style: TextStyle(
                      fontSize: context.s(17),
                      fontWeight: FontWeight.w800,
                      color: Colors.white)),
            ),
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(e.client,
                      style: TextStyle(
                          fontSize: context.s(16),
                          fontWeight: FontWeight.w600,
                          color: Colors.white)),
                  Text(e.zone,
                      style: TextStyle(
                          fontSize: context.s(13), color: AppColors.textMuted)),
                ],
              ),
            ),
            Expanded(flex: 2, child: Text(e.received, style: cell)),
            Expanded(flex: 2, child: Text(e.completed, style: cell)),
            Expanded(
              flex: 2,
              child: Text('${e.dishes}',
                  style:
                      TextStyle(fontSize: context.s(16), color: Colors.white)),
            ),
            Expanded(
              flex: 3,
              child: Align(
                alignment: Alignment.centerRight,
                child: PriorityBadge(priority: e.priority),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
