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
      body: const Center(child: Text('Member app — screens land in follow-up prompts.')),
    );
  }
}
