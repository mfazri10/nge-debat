import 'package:flutter/foundation.dart';

class ApiEndpoints {
  /// Mendeteksi host backend secara dinamis:
  /// - Android Emulator: 10.0.2.2:8080
  /// - Web / iOS Simulator / Desktop: localhost:8080
  static String get host {
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return '10.0.2.2:8080';
    }
    return 'localhost:8080';
  }

  static String get baseUrl => 'http://$host/v1';
  static String get wsBaseUrl => 'ws://$host/ws';

  // Auth
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String refresh = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String account = '/auth/account';

  // User
  static const String me = '/users/me';
  static const String mySessions = '/users/me/sessions';
  static const String myStats = '/users/me/stats';
  static const String exportData = '/users/me/export';

  // Personas
  static const String personas = '/personas';

  // Motions & Templates
  static const String motions = '/motions';
  static const String sessionTemplates = '/session-templates';

  // Sessions
  static const String sessions = '/sessions';
  static const String joinSession = '/sessions/join';
  static String sessionDetail(String id) => '/sessions/$id';
  static String sessionStart(String id) => '/sessions/$id/start';
  static String sessionPause(String id) => '/sessions/$id/pause';
  static String sessionResume(String id) => '/sessions/$id/resume';
  static String sessionEnd(String id) => '/sessions/$id/end';
  static String sessionResults(String id) => '/sessions/$id/results';
  static String sessionTranscript(String id) => '/sessions/$id/transcript';
  static String submitArgument(String id) => '/sessions/$id/arguments';

  // WebSocket arena
  static String debateWebSocket(String sessionId, String token) =>
      '$wsBaseUrl/debate/$sessionId?token=$token';
}
