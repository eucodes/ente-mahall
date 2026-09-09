import 'api_client.dart';
import '../models/auth_tokens.dart';

class AuthRepository {
  AuthRepository(this._client);

  final ApiClient _client;

  Future<AuthTokens> login({
    required String mahallSlug,
    required String email,
    required String password,
  }) async {
    final response = await _client.dio.post('/auth/login', data: {
      'mahallSlug': mahallSlug,
      'email': email,
      'password': password,
    });
    final tokens = AuthTokens.fromJson(response.data as Map<String, dynamic>);
    await _client.tokenStorage.save(accessToken: tokens.accessToken, refreshToken: tokens.refreshToken);
    return tokens;
  }

  Future<void> logout() async {
    final refreshToken = await _client.tokenStorage.readRefreshToken();
    if (refreshToken != null) {
      await _client.dio.post('/auth/logout', data: {'refreshToken': refreshToken});
    }
    await _client.tokenStorage.clear();
  }
}
