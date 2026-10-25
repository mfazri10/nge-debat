import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/websocket/debate_socket.dart';
import '../auth/auth_provider.dart';
import 'models/debate_message.dart';
import 'widgets/scorecard_overlay.dart';
import 'widgets/crowd_sentiment_bar.dart';
import 'widgets/debate_speech_bubble.dart';
import 'widgets/debate_input_bar.dart';

class ArenaScreen extends ConsumerStatefulWidget {
  final String sessionId;
  final Map<String, dynamic>? initialData;

  const ArenaScreen({
    super.key,
    required this.sessionId,
    this.initialData,
  });

  @override
  ConsumerState<ArenaScreen> createState() => _ArenaScreenState();
}

class _ArenaScreenState extends ConsumerState<ArenaScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  late final DebateSocketService _socketService;
  StreamSubscription? _socketSubscription;

  int _currentRound = 1;
  final int _totalRounds = 3;
  int _secondsLeft = 180;
  Timer? _timer;
  bool _isAiSpeaking = false;

  // Skor 3 Juri AI
  int _scoreLogika = 82;
  int _scoreRetorika = 78;
  int _scoreDampak = 85;
  String? _detectedFallacy;

  // Sentimen Penonton Live
  String _activeReaction = '👏';
  int _audienceSentiment = 75;
  String _latestCrowdComment = '“Analogi pendidikan tingginya sangat mengena!”';

  late final List<DebateMessage> _messages;

  @override
  void initState() {
    super.initState();
    final topic = widget.initialData?['topic'] ??
        'Dewan ini akan mewajibkan adopsi AI pada kurikulum pendidikan tinggi nasional';

    _messages = [
      DebateMessage(
        speaker: 'Moderator AI',
        text:
            'Selamat datang di Arena Debat. Mosi: "$topic". Giliran pembicara afirmatif (User) dipersilakan.',
        isAi: true,
      ),
    ];
    _startTimer();
    _initWebSocket();
  }

  void _initWebSocket() {
    _socketService = DebateSocketService();
    final token = ref.read(authProvider).token ?? '';
    _socketService.connect(widget.sessionId, token);

    _socketSubscription = _socketService.messages.listen((msg) {
      if (!mounted) return;
      final type = msg['type'] as String?;
      final payload = msg['payload'];

      switch (type) {
        case 'debate:ai_thinking':
          setState(() {
            _isAiSpeaking = true;
          });
          break;

        case 'debate:ai_chunk':
          if (payload is Map<String, dynamic>) {
            final content = payload['content'] as String? ?? '';
            final isDone = payload['isDone'] as bool? ?? false;
            final personaName = widget.initialData?['persona'] ?? 'AI Lawan';

            setState(() {
              if (_messages.isNotEmpty && _messages.last.isAi && _isAiSpeaking) {
                _messages.last = _messages.last.copyWith(
                  text: _messages.last.text + content,
                );
              } else {
                _messages.add(
                  DebateMessage(
                    speaker: 'Lawan ($personaName)',
                    text: content,
                    isAi: true,
                  ),
                );
              }
              if (isDone) {
                _isAiSpeaking = false;
                if (_currentRound < _totalRounds) {
                  _currentRound++;
                  _secondsLeft = 180;
                }
              }
            });
            _scrollToBottom();
          }
          break;

        case 'debate:judge_score':
          if (payload is Map<String, dynamic>) {
            final judgeType = payload['judge_type']?.toString().toUpperCase();
            final totalScore = (payload['total_score'] as num?)?.toInt() ?? 80;
            final fallacy = payload['fallacy_detected']?.toString();

            setState(() {
              if (judgeType == 'LOGIKA') {
                _scoreLogika = totalScore;
                if (fallacy != null && fallacy.isNotEmpty) {
                  _detectedFallacy = fallacy;
                }
              } else if (judgeType == 'RETORIKA') {
                _scoreRetorika = totalScore;
              } else if (judgeType == 'DAMPAK') {
                _scoreDampak = totalScore;
              }
            });
          }
          break;

        case 'debate:audience':
          if (payload is Map<String, dynamic>) {
            final reactionType = payload['reaction_type']?.toString();
            final intensity = (payload['intensity'] as num?)?.toInt() ?? 75;
            final comments = payload['comments'] as List<dynamic>?;

            setState(() {
              _audienceSentiment = intensity;
              if (reactionType == 'APPLAUSE') {
                _activeReaction = '👏';
              } else if (reactionType == 'EXCITED') {
                _activeReaction = '🔥';
              } else if (reactionType == 'BOO') {
                _activeReaction = '👎';
              } else if (reactionType == 'SKEPTICAL') {
                _activeReaction = '🤔';
              } else {
                _activeReaction = '💬';
              }

              if (comments != null && comments.isNotEmpty) {
                _latestCrowdComment = '“${comments.last}”';
              }
            });
          }
          break;

        case 'debate:error':
          if (payload is Map<String, dynamic>) {
            final errorMsg = payload['message'] as String? ?? 'Terjadi kesalahan arena';
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(errorMsg), backgroundColor: AppColors.error),
            );
          }
          break;
      }
    });
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _socketSubscription?.cancel();
    _socketService.dispose();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _submitArgument() {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(
        DebateMessage(
          speaker: 'Anda (Afirmatif)',
          text: text,
          isAi: false,
          score: 84,
        ),
      );
      _textController.clear();
      _isAiSpeaking = true;
    });
    _scrollToBottom();

    // Kirim pesan ke WebSocket API Gateway
    if (_socketService.state == DebateSocketState.connected) {
      _socketService.sendArgument(
        sessionId: widget.sessionId,
        content: text,
      );
    } else {
      // Fallback graceful simulasi jika backend offline saat development
      Future.delayed(const Duration(seconds: 2), () {
        if (!mounted) return;
        final personaName = widget.initialData?['persona'] ?? 'AI Lawan';
        setState(() {
          _messages.add(
            DebateMessage(
              speaker: 'Lawan ($personaName)',
              text:
                  'Saudara pembicara melupakan disparitas infrastruktur digital di wilayah 3T. Kebijakan ini berisiko memperlebar jurang ketimpangan jika dipaksakan tanpa kesiapan fasilitas pendukung.',
              isAi: true,
              score: 85,
            ),
          );
          _isAiSpeaking = false;
          _scoreLogika = 86;
          _scoreRetorika = 80;
          _scoreDampak = 84;
          _audienceSentiment = 80;
          _latestCrowdComment = '“Sanggahan oposisi tajam pada isu pemerataan fasilitas!”';
        });
        _scrollToBottom();
      });
    }
  }

  void _finishDebate() {
    _socketService.sendForfeit(widget.sessionId);
    context.pushReplacement('/results/${widget.sessionId}', extra: {
      'scoreLogika': _scoreLogika,
      'scoreRetorika': _scoreRetorika,
      'scoreDampak': _scoreDampak,
      'totalScore': ((_scoreLogika + _scoreRetorika + _scoreDampak) / 3).round(),
      'eloChange': '+24',
      'winner': 'Afirmatif (Anda)',
    });
  }

  @override
  Widget build(BuildContext context) {
    final minutes = (_secondsLeft ~/ 60).toString().padLeft(2, '0');
    final seconds = (_secondsLeft % 60).toString().padLeft(2, '0');

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                backgroundColor: AppColors.surface,
                title: const Text('Tinggalkan Arena?',
                    style: TextStyle(color: Colors.white)),
                content: const Text(
                  'Jika keluar saat debat berlangsung, penalti ELO dapat dikenakan.',
                  style: TextStyle(color: AppColors.textSecondary),
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Lanjutkan Debat'),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      context.pop();
                    },
                    child: const Text('Keluar',
                        style: TextStyle(color: AppColors.error)),
                  ),
                ],
              ),
            );
          },
        ),
        title: Column(
          children: [
            Text(
              'Ronde $_currentRound / $_totalRounds',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.timer_outlined,
                    size: 12, color: AppColors.accent),
                const SizedBox(width: 4),
                Text(
                  '$minutes:$seconds',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.accent,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ],
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.flag_outlined, color: AppColors.warning),
            tooltip: 'Selesaikan & Evaluasi Juri',
            onPressed: _finishDebate,
          ),
        ],
      ),
      body: Column(
        children: [
          // Floating 3-Judges Scorecard
          ScorecardOverlay(
            scoreLogika: _scoreLogika,
            scoreRetorika: _scoreRetorika,
            scoreDampak: _scoreDampak,
            detectedFallacy: _detectedFallacy,
          ),

          // Live Crowd Sentiment Gauge
          CrowdSentimentBar(
            sentimentPercent: _audienceSentiment,
            activeReaction: _activeReaction,
            latestComment: _latestCrowdComment,
          ),

          // Debate Messages Feed
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(vertical: 12),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return DebateSpeechBubble(message: _messages[index]);
              },
            ),
          ),

          // Speech Input Bar
          DebateInputBar(
            controller: _textController,
            isAiSpeaking: _isAiSpeaking,
            onSubmit: _submitArgument,
          ),
        ],
      ),
    );
  }
}
