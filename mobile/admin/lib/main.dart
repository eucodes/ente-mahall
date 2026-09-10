import 'package:ente_mahall_core/ente_mahall_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(child: EnteMahallAdminApp()));
}

class EnteMahallAdminApp extends StatelessWidget {
  const EnteMahallAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ente Mahall Admin',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const _PlaceholderHome(),
    );
  }
}

class _PlaceholderHome extends StatelessWidget {
  const _PlaceholderHome();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ente Mahall Admin')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Admin app — screens land in follow-up prompts.'),
            const SizedBox(height: 16),
            // Reference pattern for future screens: always use showAppSnackBar /
            // showAppConfirmDialog / showAppAlertDialog from ente_mahall_core,
            // never a bare ScaffoldMessenger/showDialog call.
            FilledButton(
              onPressed: () async {
                final confirmed = await showAppConfirmDialog(
                  context,
                  title: 'Preview confirm dialog',
                  description: 'This is the shared confirm-dialog style.',
                  destructive: true,
                );
                if (context.mounted) {
                  showAppSnackBar(
                    context,
                    message: confirmed ? 'Confirmed' : 'Cancelled',
                    type: confirmed ? AppSnackBarType.success : AppSnackBarType.info,
                  );
                }
              },
              child: const Text('Preview confirm dialog'),
            ),
          ],
        ),
      ),
    );
  }
}
