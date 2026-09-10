import 'package:ente_mahall_core/ente_mahall_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  runApp(const ProviderScope(child: EnteMahallMemberApp()));
}

class EnteMahallMemberApp extends StatelessWidget {
  const EnteMahallMemberApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ente Mahall',
      theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
      home: const _PlaceholderHome(),
    );
  }
}

class _PlaceholderHome extends StatelessWidget {
  const _PlaceholderHome();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ente Mahall')),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Member app — screens land in follow-up prompts.'),
            const SizedBox(height: 16),
            // Reference pattern for future screens: always use showAppSnackBar /
            // showAppConfirmDialog / showAppAlertDialog from ente_mahall_core,
            // never a bare ScaffoldMessenger/showDialog call.
            FilledButton(
              onPressed: () => showAppSnackBar(
                context,
                message: 'This is the shared message style',
                type: AppSnackBarType.success,
              ),
              child: const Text('Preview message style'),
            ),
          ],
        ),
      ),
    );
  }
}
