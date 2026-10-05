enum OrderStatus { pending, preparing, ready }
enum Priority { low, normal, high }

class Order {
  final String id, customer, time;
  final OrderStatus status;
  final Priority priority;
  final List<String> items;
  final int portions;
  const Order({required this.id, required this.customer, required this.time, required this.status, required this.priority, required this.items, required this.portions});
  Order copyWith({OrderStatus? status}) => Order(id: id, customer: customer, time: time, status: status ?? this.status, priority: priority, items: items, portions: portions);
}
