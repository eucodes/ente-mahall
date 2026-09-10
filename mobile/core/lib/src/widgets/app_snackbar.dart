import 'package:flutter/material.dart';

enum AppSnackBarType { success, error, info, warning }

/// App-wide replacement for calling [ScaffoldMessenger] with a bare
/// [SnackBar] — keeps message styling (color, icon) consistent everywhere
/// instead of every screen picking its own.
void showAppSnackBar(
  BuildContext context, {
  required String message,
  AppSnackBarType type = AppSnackBarType.info,
}) {
  final (color, icon) = switch (type) {
    AppSnackBarType.success => (Colors.green.shade700, Icons.check_circle_outline),
    AppSnackBarType.error => (Colors.red.shade700, Icons.error_outline),
    AppSnackBarType.warning => (Colors.orange.shade800, Icons.warning_amber_outlined),
    AppSnackBarType.info => (Theme.of(context).colorScheme.inverseSurface, Icons.info_outline),
  };

  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        content: Row(
          children: [
            Icon(icon, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(child: Text(message, style: const TextStyle(color: Colors.white))),
          ],
        ),
      ),
    );
}
