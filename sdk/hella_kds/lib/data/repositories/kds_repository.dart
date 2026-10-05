import 'package:flutter/foundation.dart';
import '../models/order.dart';

class KdsRepository extends ChangeNotifier {
  List<Order> orders = [];
  final Map<String, bool> availability = {'Salmón al limón': true, 'Pollo rostizado': true, 'Pasta fresca': true, 'Tiramisú de café': false, 'Crema de tomate': true};
  KdsRepository() { orders = seedOrders(); }
  void updateStatus(Order order, OrderStatus status) { orders = orders.map((item) => item.id == order.id ? item.copyWith(status: status) : item).toList(); notifyListeners(); }
  void toggleAvailability(String dish) { availability[dish] = !(availability[dish] ?? false); notifyListeners(); }
  void refresh() { orders = seedOrders(); notifyListeners(); }
}

List<Order> seedOrders() => const [
  Order(id: 'HL-1048', customer: 'Mariana López', time: '12:42', status: OrderStatus.pending, priority: Priority.high, items: ['Salmón al limón', 'Ensalada de temporada'], portions: 2),
  Order(id: 'HL-1047', customer: 'Carlos Mendoza', time: '12:31', status: OrderStatus.preparing, priority: Priority.normal, items: ['Pollo rostizado', 'Arroz cremoso'], portions: 4),
  Order(id: 'HL-1046', customer: 'Sofía Torres', time: '12:18', status: OrderStatus.ready, priority: Priority.normal, items: ['Pasta fresca', 'Tiramisú de café'], portions: 2),
  Order(id: 'HL-1045', customer: 'Diego Ramírez', time: '11:56', status: OrderStatus.pending, priority: Priority.low, items: ['Crema de tomate', 'Vegetales asados'], portions: 1),
];
