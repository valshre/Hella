import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

// ─────────────────────────────────────────────────────────────
// Prioridad
// ─────────────────────────────────────────────────────────────
enum Priority { urgente, alta, normal }

extension PriorityX on Priority {
  String get label {
    switch (this) {
      case Priority.urgente:
        return 'URGENTE';
      case Priority.alta:
        return 'PRIORIDAD ALTA';
      case Priority.normal:
        return 'NORMAL';
    }
  }
}

class PriorityBadge extends StatelessWidget {
  const PriorityBadge({super.key, required this.priority});
  final Priority priority;

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    Color border;
    switch (priority) {
      case Priority.urgente:
        bg = AppColors.red;
        fg = Colors.white;
        border = AppColors.red;
        break;
      case Priority.alta:
        bg = AppColors.redSoft;
        fg = Colors.white;
        border = AppColors.red;
        break;
      case Priority.normal:
        bg = Colors.transparent;
        fg = AppColors.textMuted;
        border = AppColors.borderStrong;
        break;
    }
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: context.s(10), vertical: context.s(5)),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(context.s(7)),
        border: Border.all(color: border),
      ),
      child: Text(
        priority.label,
        style: TextStyle(
          fontSize: context.s(11),
          fontWeight: FontWeight.w800,
          letterSpacing: 0.6,
          color: fg,
        ),
      ),
    );
  }
}

class TvFocusable extends StatefulWidget {
  const TvFocusable({
    super.key,
    required this.builder,
    this.onTap,
    this.radius = 12,
    this.autofocus = false,
    this.focusNode,
    this.focusable = true,
    this.scaleOnFocus = true,
  });

  final Widget Function(BuildContext context, bool focused) builder;
  final VoidCallback? onTap;
  final double radius;
  final bool autofocus;
  final FocusNode? focusNode;
  final bool focusable;
  final bool scaleOnFocus;

  @override
  State<TvFocusable> createState() => _TvFocusableState();
}

class _TvFocusableState extends State<TvFocusable> {
  bool _focused = false;
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return FocusableActionDetector(
      enabled: widget.focusable,
      focusNode: widget.focusNode,
      autofocus: widget.autofocus,
      mouseCursor:
          widget.onTap != null ? SystemMouseCursors.click : MouseCursor.defer,
      onShowFocusHighlight: (v) => setState(() => _focused = v),
      onShowHoverHighlight: (v) => setState(() => _hover = v),
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) {
          widget.onTap?.call();
          return null;
        }),
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: widget.onTap,
        child: AnimatedScale(
          scale: (_focused && widget.scaleOnFocus) ? 1.02 : 1.0,
          duration: const Duration(milliseconds: 140),
          curve: Curves.easeOut,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 140),
            foregroundDecoration: BoxDecoration(
              borderRadius: BorderRadius.circular(widget.radius),
              color: _hover ? const Color(0x0DFFFFFF) : null,
              border: Border.all(
                color: _focused ? Colors.white : Colors.transparent,
                width: 3,
              ),
            ),
            child: widget.builder(context, _focused),
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Botón
// ─────────────────────────────────────────────────────────────
enum TvButtonStyle { primary, light, outline, danger }

class TvButton extends StatelessWidget {
  const TvButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.style = TvButtonStyle.primary,
    this.expand = false,
    this.height,
    this.fontSize,
    this.autofocus = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final TvButtonStyle style;
  final bool expand;
  final double? height;
  final double? fontSize;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    final enabled = onPressed != null;
    Color bg;
    Color fg;
    Color border;
    switch (style) {
      case TvButtonStyle.primary:
        bg = AppColors.red;
        fg = Colors.white;
        border = AppColors.red;
        break;
      case TvButtonStyle.light:
        bg = Colors.white;
        fg = AppColors.red;
        border = Colors.white;
        break;
      case TvButtonStyle.outline:
        bg = Colors.transparent;
        fg = Colors.white;
        border = AppColors.borderStrong;
        break;
      case TvButtonStyle.danger:
        bg = Colors.transparent;
        fg = AppColors.redLight;
        border = AppColors.red;
        break;
    }
    if (!enabled) {
      bg = AppColors.surfaceHigh;
      fg = AppColors.textMuted;
      border = AppColors.border;
    }
    final fs = fontSize ?? context.s(15);

    return TvFocusable(
      onTap: onPressed,
      autofocus: autofocus,
      focusable: enabled,
      radius: context.s(10),
      builder: (_, __) => Container(
        height: height ?? context.s(50),
        padding: EdgeInsets.symmetric(horizontal: context.s(18)),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(context.s(10)),
          border: Border.all(color: border, width: 1.4),
        ),
        child: Row(
          mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              Icon(icon, size: fs * 1.25, color: fg),
              SizedBox(width: context.s(8)),
            ],
            Flexible(
              child: Text(
                label,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    fontSize: fs, fontWeight: FontWeight.w700, color: fg),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Chip de filtro
// ─────────────────────────────────────────────────────────────
class TvChip extends StatelessWidget {
  const TvChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
    this.count,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final int? count;

  @override
  Widget build(BuildContext context) {
    return TvFocusable(
      onTap: onTap,
      radius: context.s(10),
      builder: (_, __) => AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: EdgeInsets.symmetric(
            horizontal: context.s(18), vertical: context.s(11)),
        decoration: BoxDecoration(
          color: selected ? AppColors.red : AppColors.surface,
          borderRadius: BorderRadius.circular(context.s(10)),
          border: Border.all(
              color: selected ? AppColors.red : AppColors.borderStrong),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label,
                style: TextStyle(
                    color: Colors.white,
                    fontSize: context.s(15),
                    fontWeight: FontWeight.w700)),
            if (count != null) ...[
              SizedBox(width: context.s(10)),
              Container(
                padding: EdgeInsets.symmetric(
                    horizontal: context.s(8), vertical: context.s(2)),
                decoration: BoxDecoration(
                  color: selected ? Colors.white : AppColors.surfaceHigh,
                  borderRadius: BorderRadius.circular(context.s(10)),
                ),
                child: Text('$count',
                    style: TextStyle(
                        fontSize: context.s(12),
                        fontWeight: FontWeight.w800,
                        color: selected ? AppColors.red : AppColors.textMuted)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Campo de texto con borde de foco
// (nota: dentro de un campo de texto, ←/→ mueven el cursor;
//  ↑/↓ sacan el foco en campos de una línea)
// ─────────────────────────────────────────────────────────────
class TvTextField extends StatefulWidget {
  const TvTextField({
    super.key,
    this.controller,
    this.hint,
    this.icon,
    this.maxLines = 1,
    this.onChanged,
  });

  final TextEditingController? controller;
  final String? hint;
  final IconData? icon;
  final int maxLines;
  final ValueChanged<String>? onChanged;

  @override
  State<TvTextField> createState() => _TvTextFieldState();
}

class _TvTextFieldState extends State<TvTextField> {
  final FocusNode _node = FocusNode();

  @override
  void initState() {
    super.initState();
    _node.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final multi = widget.maxLines > 1;
    final focused = _node.hasFocus;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 140),
      constraints: BoxConstraints(minHeight: context.s(52)),
      padding: EdgeInsets.symmetric(
          horizontal: context.s(16), vertical: multi ? context.s(14) : 0),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(context.s(10)),
        border: Border.all(
          color: focused ? Colors.white : AppColors.border,
          width: focused ? 3 : 1.2,
        ),
      ),
      child: Row(
        crossAxisAlignment:
            multi ? CrossAxisAlignment.start : CrossAxisAlignment.center,
        children: [
          if (widget.icon != null) ...[
            Icon(widget.icon, color: AppColors.textMuted, size: context.s(22)),
            SizedBox(width: context.s(10)),
          ],
          Expanded(
            child: TextField(
              controller: widget.controller,
              focusNode: _node,
              maxLines: widget.maxLines,
              minLines: multi ? widget.maxLines : 1,
              onChanged: widget.onChanged,
              cursorColor: Colors.white,
              style: TextStyle(color: Colors.white, fontSize: context.s(16)),
              decoration: InputDecoration.collapsed(
                hintText: widget.hint,
                hintStyle: TextStyle(
                    color: AppColors.textMuted, fontSize: context.s(15)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────
// Dropdown
// ─────────────────────────────────────────────────────────────
class TvDropdown extends StatefulWidget {
  const TvDropdown({
    super.key,
    required this.value,
    required this.items,
    required this.onChanged,
    this.width,
  });

  final String value;
  final List<String> items;
  final ValueChanged<String> onChanged;

  /// Ancho fijo opcional. Con ancho fijo el menú se expande dentro de él;
  /// sin ancho, se ajusta a su contenido (seguro dentro de un Row).
  final double? width;

  @override
  State<TvDropdown> createState() => _TvDropdownState();
}

class _TvDropdownState extends State<TvDropdown> {
  final FocusNode _node = FocusNode();

  @override
  void initState() {
    super.initState();
    _node.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final focused = _node.hasFocus;
    final box = AnimatedContainer(
      duration: const Duration(milliseconds: 140),
      constraints: BoxConstraints(minHeight: context.s(52)),
      padding: EdgeInsets.symmetric(horizontal: context.s(16)),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(context.s(10)),
        border: Border.all(
          color: focused ? Colors.white : AppColors.border,
          width: focused ? 3 : 1.2,
        ),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          focusNode: _node,
          value: widget.value,
          isExpanded: widget.width != null,
          dropdownColor: AppColors.surfaceHigh,
          iconEnabledColor: Colors.white,
          borderRadius: BorderRadius.circular(context.s(10)),
          style: TextStyle(color: Colors.white, fontSize: context.s(15)),
          items: widget.items
              .map((e) => DropdownMenuItem(value: e, child: Text(e)))
              .toList(),
          onChanged: (v) {
            if (v != null) widget.onChanged(v);
          },
        ),
      ),
    );
    return widget.width == null
        ? box
        : SizedBox(width: widget.width, child: box);
  }
}

// ─────────────────────────────────────────────────────────────
// Encabezado de pantalla y estado vacío
// ─────────────────────────────────────────────────────────────
class ScreenHeader extends StatelessWidget {
  const ScreenHeader(
      {super.key, required this.title, required this.subtitle, this.trailing});

  final String title;
  final String subtitle;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: TextStyle(
                      fontSize: context.s(28),
                      fontWeight: FontWeight.w800,
                      color: Colors.white)),
              SizedBox(height: context.s(4)),
              Text(subtitle,
                  style: TextStyle(
                      fontSize: context.s(15), color: AppColors.textMuted)),
            ],
          ),
        ),
        if (trailing != null) ...[
          SizedBox(width: context.s(16)),
          trailing!,
        ],
      ],
    );
  }
}

class EmptyState extends StatelessWidget {
  const EmptyState({super.key, required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.search_off_rounded,
              size: context.s(48), color: AppColors.borderStrong),
          SizedBox(height: context.s(12)),
          Text(message,
              style: TextStyle(
                  fontSize: context.s(16), color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
