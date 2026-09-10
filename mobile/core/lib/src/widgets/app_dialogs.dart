import 'package:flutter/material.dart';

/// App-wide replacement for calling [showDialog] directly with a bare
/// [AlertDialog] — every confirmation prompt goes through this so wording
/// and button order stay consistent across the app.
///
/// Returns `true` only if the user tapped the confirm action; `false` for
/// cancel, back button, or tapping outside the dialog.
Future<bool> showAppConfirmDialog(
  BuildContext context, {
  required String title,
  String? description,
  String confirmLabel = 'Confirm',
  String cancelLabel = 'Cancel',
  bool destructive = false,
}) async {
  final result = await showDialog<bool>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: description != null ? Text(description) : null,
      actions: [
        TextButton(onPressed: () => Navigator.of(context).pop(false), child: Text(cancelLabel)),
        FilledButton(
          style: destructive
              ? FilledButton.styleFrom(backgroundColor: Theme.of(context).colorScheme.error)
              : null,
          onPressed: () => Navigator.of(context).pop(true),
          child: Text(confirmLabel),
        ),
      ],
    ),
  );
  return result ?? false;
}

/// App-wide replacement for a single-button informational [AlertDialog].
Future<void> showAppAlertDialog(
  BuildContext context, {
  required String title,
  String? description,
  String dismissLabel = 'OK',
}) {
  return showDialog<void>(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(title),
      content: description != null ? Text(description) : null,
      actions: [
        FilledButton(onPressed: () => Navigator.of(context).pop(), child: Text(dismissLabel)),
      ],
    ),
  );
}
