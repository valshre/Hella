import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/animation.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/painting.dart';

class KdsFocus extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  final FocusNode? focusNode;
  final EdgeInsetsGeometry? padding;
  const KdsFocus(
      {super.key,
      required this.child,
      this.onPressed,
      this.focusNode,
      this.padding});
  @override
  State<KdsFocus> createState() => _KdsFocusState();
}

class _KdsFocusState extends State<KdsFocus> {
  late final FocusNode _node = widget.focusNode ?? FocusNode();
  @override
  void dispose() {
    if (widget.focusNode == null) _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Focus(
        focusNode: _node,
        onKeyEvent: (_, event) {
          if (event is KeyDownEvent &&
              (event.logicalKey == LogicalKeyboardKey.enter ||
                  event.logicalKey == LogicalKeyboardKey.select ||
                  event.logicalKey == LogicalKeyboardKey.space)) {
            widget.onPressed?.call();
            return KeyEventResult.handled;
          }
          return KeyEventResult.ignored;
        },
        child: Builder(builder: (context) {
          final focused = Focus.of(context).hasFocus;
          return GestureDetector(
              onTap: () {
                _node.requestFocus();
                widget.onPressed?.call();
              },
              child: AnimatedContainer(
                  duration: const Duration(milliseconds: 120),
                  padding: widget.padding,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                          color: focused ? AppTheme.amber : Colors.transparent,
                          width: 3),
                      boxShadow: focused
                          ? [
                              BoxShadow(
                                  color: AppTheme.amber.withOpacity(.25),
                                  blurRadius: 14)
                            ]
                          : null),
                  child: widget.child));
        }),
      );
}

class TouchButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color? color;
  const TouchButton(
      {super.key, required this.label, this.onPressed, this.icon, this.color});
  @override
  Widget build(BuildContext context) => SizedBox(
      height: 64,
      child: ElevatedButton.icon(
          onPressed: onPressed,
          icon: Icon(icon ?? Icons.check_circle_outline),
          label: Text(label),
          style: ElevatedButton.styleFrom(
              minimumSize: const Size(64, 64),
              backgroundColor: color ?? AppTheme.amber,
              foregroundColor: Colors.black,
              textStyle: const TextStyle(fontWeight: FontWeight.bold),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14)))));
}
