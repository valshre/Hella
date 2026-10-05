import 'package:flutter/material.dart';
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
}

class HistorialScreen extends StatefulWidget {
  const HistorialScreen({super.key});

  @override
  State<HistorialScreen> createState() => _HistorialScreenState();
}

class _HistorialScreenState extends State<HistorialScreen> {
  static const _entries = [
    _Entry('#1040', 'Diego Salas', 'Milenio III', '12:05', '12:22', 3,
        Priority.normal),
    _Entry('#1039', 'Marta Olvera', 'Juriquilla', '11:42', '12:01', 5,
        Priority.alta),
    _Entry('#1038', 'Carlos Pineda', 'Centro Histórico', '11:30', '11:48', 2,
        Priority.normal),
  ];

  Priority? _filter; // null = todas
  String _query = '';

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
                  Expanded(
                    child: rows.isEmpty
                        ? const EmptyState(message: 'Sin resultados')
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
