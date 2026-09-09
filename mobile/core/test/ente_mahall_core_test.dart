import 'package:flutter_test/flutter_test.dart';

import 'package:ente_mahall_core/ente_mahall_core.dart';

void main() {
  test('userRoleFromJson maps backend enum values', () {
    expect(userRoleFromJson('MAHALL_ADMIN'), UserRole.mahallAdmin);
  });
}
