import 'package:flutter/material.dart';

class RecipeModal extends StatelessWidget {
  const RecipeModal({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF1E1E1E),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: 500,
        padding: const EdgeInsets.all(24),
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
                    Text('PASTAS',
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
            const Text('Pasta Alfredo',
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white)),
            const SizedBox(height: 16),
            const Text('NÚMERO DE PORCIONES',
                style: TextStyle(fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                  color: const Color(0xFF2A2A2A),
                  borderRadius: BorderRadius.circular(6)),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('1 porción', style: TextStyle(color: Colors.white)),
                  Icon(Icons.arrow_drop_down, color: Colors.white),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text('Ingredientes para 1 porción',
                style: TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 8),
            _buildIngredientRow('Pasta fresca', '100 g'),
            _buildIngredientRow('Crema para cocinar', '50 ml'),
            _buildIngredientRow('Queso parmesano', '40 g'),
            _buildIngredientRow('Mantequilla', '10 g'),
            const SizedBox(height: 16),
            const Text('Preparación',
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.white)),
            const SizedBox(height: 8),
            Row(
              children: [
                Checkbox(value: false, onChanged: (v) {}),
                const Text('1. Cocer la pasta en agua con sal.',
                    style: TextStyle(color: Colors.white70)),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 45,
              child: ElevatedButton(
                style:
                    ElevatedButton.styleFrom(backgroundColor: Colors.grey[800]),
                onPressed: () => Navigator.pop(context),
                child: const Text('Cerrar receta',
                    style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIngredientRow(String name, String qty) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name, style: const TextStyle(color: Colors.white70)),
          Text(qty,
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
