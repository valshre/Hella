import 'dart:convert';
import 'package:http/http.dart' as http;

const _baseUrl = 'https://hella-i3o7.onrender.com/sdk';

class ApiException implements Exception {
  final String message;
  ApiException(this.message);
  @override
  String toString() => message;
}

class HellaApi {
  // Render (plan free) tarda en despertar: timeout generoso.
  static const _timeout = Duration(seconds: 60);
  static const _headers = {'Content-Type': 'application/json'};

  static dynamic _decode(http.Response r) {
    final ok = r.statusCode >= 200 && r.statusCode < 300;
    dynamic body;
    try {
      body = r.body.isEmpty ? null : jsonDecode(utf8.decode(r.bodyBytes));
    } catch (_) {
      // El servidor devolvió HTML (p. ej. ruta inexistente) en vez de JSON.
      throw ApiException(r.statusCode == 404
          ? 'Ruta no encontrada en el servidor (404)'
          : ok
              ? 'Respuesta inválida del servidor'
              : 'Error ${r.statusCode}');
    }
    if (ok) return body;
    throw ApiException(
        (body is Map ? body['error'] : null) ?? 'Error ${r.statusCode}');
  }

  static Future<dynamic> _get(String p) async =>
      _decode(await http.get(Uri.parse('$_baseUrl$p')).timeout(_timeout));

  static Future<dynamic> _send(String m, String p, Map body) async {
    final req = http.Request(m, Uri.parse('$_baseUrl$p'))
      ..headers.addAll(_headers)
      ..body = jsonEncode(body);
    final res =
        await http.Response.fromStream(await req.send().timeout(_timeout));
    return _decode(res);
  }

  // GET /platillos (incluye categoria_nombre y disponible)
  static Future<List<Map<String, dynamic>>> platillosRaw() async =>
      ((await _get('/platillos')) as List)
          .map((e) => Map<String, dynamic>.from(e))
          .toList();

  // GET /kds/receta/:platillo_id
  static Future<Map<String, dynamic>> kdsReceta(int platilloId) async =>
      Map<String, dynamic>.from(await _get('/kds/receta/$platilloId'));

  // PATCH /kds/platillos/:id/toggle
  static Future<void> kdsTogglePlatillo(int id, bool disponible) =>
      _send('PATCH', '/kds/platillos/$id/toggle', {'disponible': disponible});

  // GET /kds/historial  (ruta nueva: hay que agregarla al backend)
  static Future<List<Map<String, dynamic>>> kdsHistorial() async =>
      ((await _get('/kds/historial')) as List)
          .map((e) => Map<String, dynamic>.from(e))
          .toList();

  // GET /kds/configuracion
  static Future<Map<String, dynamic>> kdsConfiguracion() async =>
      Map<String, dynamic>.from(await _get('/kds/configuracion'));
}
