import 'package:dio/dio.dart';

import 'token_storage.dart';

/// Thin wrapper around [Dio] that attaches the access token to every request
/// and transparently refreshes it once on a 401 before retrying.
class ApiClient {
  ApiClient({required String baseUrl, TokenStorage? tokenStorage})
      : _tokenStorage = tokenStorage ?? TokenStorage(),
        dio = Dio(BaseOptions(baseUrl: baseUrl)) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _tokenStorage.readAccessToken();
          if (token != null) options.headers['Authorization'] = 'Bearer $token';
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode != 401) return handler.next(error);

          final refreshToken = await _tokenStorage.readRefreshToken();
          if (refreshToken == null) return handler.next(error);

          try {
            final response = await dio.post('/auth/refresh', data: {'refreshToken': refreshToken});
            final accessToken = response.data['accessToken'] as String;
            final newRefreshToken = response.data['refreshToken'] as String;
            await _tokenStorage.save(accessToken: accessToken, refreshToken: newRefreshToken);

            final retryRequest = error.requestOptions;
            retryRequest.headers['Authorization'] = 'Bearer $accessToken';
            final retryResponse = await dio.fetch(retryRequest);
            return handler.resolve(retryResponse);
          } catch (_) {
            await _tokenStorage.clear();
            return handler.next(error);
          }
        },
      ),
    );
  }

  final Dio dio;
  final TokenStorage _tokenStorage;

  TokenStorage get tokenStorage => _tokenStorage;
}
