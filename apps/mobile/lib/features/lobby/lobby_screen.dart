import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/api_endpoints.dart';
import '../../core/network/api_client.dart';
import '../../core/theme/app_theme.dart';
import '../auth/auth_provider.dart';
import 'widgets/user_stat_card.dart';
import 'widgets/motion_picker.dart';
import 'widgets/persona_slider.dart';

class LobbyScreen extends ConsumerStatefulWidget {
  const LobbyScreen({super.key});

  @override
  ConsumerState<LobbyScreen> createState() => _LobbyScreenState();
}

class _LobbyScreenState extends ConsumerState<LobbyScreen> {
  String _selectedTopic =
      'Dewan ini akan mewajibkan adopsi AI pada kurikulum pendidikan tinggi nasional.';
  String _selectedFormat = 'KDMI';
  String _selectedStance = 'PRO';
  String _selectedPersona = 'Presiden RI';
  bool _isLoading = false;

  List<String> _sampleMotions = [
    'Dewan ini akan mewajibkan adopsi AI pada kurikulum pendidikan tinggi nasional.',
    'Dewan ini percaya subsidi kendaraan listrik memperlebar kesenjangan ekonomi.',
    'Dewan ini akan melarang algoritma media sosial yang memicu kemarahan publik.',
    'This House would ban commercial development of autonomous AI weapons.',
    'This House believes universal basic income should replace conditional welfare.',
  ];

  final List<Map<String, String>> _personas = [
    {'name': 'Presiden RI', 'desc': 'Diplomatis, stabilitas nasional, berwibawa'},
    {'name': 'Menteri Keuangan', 'desc': 'Rasional, data fiskal & disiplin APBN'},
    {'name': 'Hakim MK', 'desc': 'Hukum konstitusi, hak asasi & keadilan'},
    {'name': 'Aktivis Lingkungan', 'desc': 'Urgensi krisis iklim & keadilan sosial'},
    {'name': 'Silicon Valley CEO', 'desc': 'Disrupsi AI, pasar bebas & masa depan'},
  ];

  @override
  void initState() {
    super.initState();
    _fetchLiveMotions();
  }

  Future<void> _fetchLiveMotions() async {
    try {
      final client = ApiClient();
      final res = await client.get(ApiEndpoints.motions);
      if (res.statusCode == 200 && res.data is List && (res.data as List).isNotEmpty) {
        final liveMotions = (res.data as List)
            .map((m) => m['text']?.toString() ?? '')
            .where((t) => t.isNotEmpty)
            .toList();
        if (liveMotions.isNotEmpty && mounted) {
          setState(() {
            _sampleMotions = liveMotions;
            _selectedTopic = liveMotions.first;
          });
        }
      }
    } catch (_) {
      // Menggunakan sample motions bawaan jika offline
    }
  }

  Future<void> _startDebate() async {
    setState(() => _isLoading = true);
    String sessionId = 'deb-${DateTime.now().millisecondsSinceEpoch % 10000}';

    try {
      final client = ApiClient();
      final res = await client.post(ApiEndpoints.sessions, data: {
        'topic': _selectedTopic,
        'format': _selectedFormat,
        'stance': _selectedStance,
        'persona_name': _selectedPersona,
        'total_rounds': 3,
        'time_per_turn': 180,
      });

      if (res.statusCode == 200 || res.statusCode == 201) {
        if (res.data is Map && res.data['id'] != null) {
          sessionId = res.data['id'].toString();
        }
      }
    } catch (_) {
      // Fallback ID lokal
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }

    if (!mounted) return;
    context.push('/arena/$sessionId', extra: {
      'topic': _selectedTopic,
      'format': _selectedFormat,
      'stance': _selectedStance,
      'persona': _selectedPersona,
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.mic, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'DeBeat.AI Lobby',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User ELO & Quota Header Card
            UserStatCard(user: user),

            const SizedBox(height: 24),

            // Motion & Format Picker
            MotionPicker(
              sampleMotions: _sampleMotions,
              selectedMotion: _selectedTopic,
              selectedFormat: _selectedFormat,
              selectedStance: _selectedStance,
              onMotionSelected: (m) => setState(() => _selectedTopic = m),
              onFormatSelected: (f) => setState(() => _selectedFormat = f),
              onStanceSelected: (s) => setState(() => _selectedStance = s),
            ),

            const SizedBox(height: 24),

            // AI Opponent Persona Slider
            PersonaSlider(
              personas: _personas,
              selectedPersona: _selectedPersona,
              onPersonaSelected: (p) => setState(() => _selectedPersona = p),
            ),

            const SizedBox(height: 32),

            // Enter Arena Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton.icon(
                icon: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.flash_on, color: Colors.white),
                label: Text(
                  _isLoading ? 'Menyiapkan Arena...' : 'Masuk ke Arena Debat',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  elevation: 6,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                onPressed: _isLoading ? null : _startDebate,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
