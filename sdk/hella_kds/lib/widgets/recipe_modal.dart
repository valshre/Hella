import 'dart:convert';
import 'package:flutter/material.dart';

class RecipeModal extends StatelessWidget {
  const RecipeModal({super.key, this.receta});

  /// Fila de `recetas` + platillo_nombre + imagen_url (GET /kds/receta/:id).
  final Map<String, dynamic>? receta;

  // Acepta List, JSON en texto o texto separado por saltos de línea.
  static List<dynamic> _asList(dynamic v) {
    if (v is List) return v;
    if (v is String && v.trim().isNotEmpty) {
      final t = v.trim();
      if (t.startsWith('[')) {
        try {
          return jsonDecode(t) as List;
        } catch (_) {}
      }
      return t.split('\n').where((l) => l.trim().isNotEmpty).toList();
    }
    return const [];
  }

  @override
  Widget build(BuildContext context) {
    final r = receta;
    final titulo = '${r?['platillo_nombre'] ?? 'Pasta Alfredo'}';

    // ⚠️ Ajusta estas claves a las columnas reales de tu tabla `recetas`.
    final ingredientes = r == null ? const [] : _asList(r['ingredientes']);
    final pasos = r == null
        ? const []
        : _asList(r['pasos'] ?? r['preparacion'] ?? r['instrucciones']);

    return Dialog(
      backgroundColor: const Color(0xFF1E1E1E),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: 500,
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.menu_book, color: Colors.red),
                      const SizedBox(width: 8),
                      Text('RECETA',
                          style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[400],
                              fontWeight: FontWeight.bold)),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              Text(titulo,
                  style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white)),
              const SizedBox(height: 16),
              const Text('Ingredientes',
                  style: TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 8),
              if (r == null) ...[
                _buildIngredientRow('Pasta fresca', '100 g'),
                _buildIngredientRow('Crema para cocinar', '50 ml'),
                _buildIngredientRow('Queso parmesano', '40 g'),
                _buildIngredientRow('Mantequilla', '10 g'),
              ] else if (ingredientes.isEmpty)
                const Text('Sin ingredientes registrados.',
                    style: TextStyle(color: Colors.white54))
              else
                for (final i in ingredientes) _ingredient(i),
              const SizedBox(height: 16),
              const Text('Preparación',
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white)),
              const SizedBox(height: 8),
              if (r == null)
                Row(
                  children: [
                    Checkbox(value: false, onChanged: (v) {}),
                    const Text('1. Cocer la pasta en agua con sal.',
                        style: TextStyle(color: Colors.white70)),
                  ],
                )
              else if (pasos.isEmpty)
                const Text('Sin pasos registrados.',
                    style: TextStyle(color: Colors.white54))
              else
                for (var n = 0; n < pasos.length; n++) _step(n + 1, pasos[n]),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 45,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[800]),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cerrar receta',
                      style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _ingredient(dynamic i) {
    if (i is Map) {
      final name = '${i['nombre'] ?? i['ingrediente'] ?? ''}';
      final qty = '${i['cantidad'] ?? ''} ${i['unidad'] ?? ''}'.trim();
      return _buildIngredientRow(name, qty);
    }
    return _buildIngredientRow('$i', '');
  }

  Widget _step(int n, dynamic s) {
    final text = s is Map ? '${s['descripcion'] ?? s['paso'] ?? ''}' : '$s';
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Text('$n. $text', style: const TextStyle(color: Colors.white70)),
    );
  }

  Widget _buildIngredientRow(String name, String qty) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
              child: Text(name, style: const TextStyle(color: Colors.white70))),
          Text(qty,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
