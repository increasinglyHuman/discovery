<?php
/**
 * PATHFINDER Scoreboard API
 * Simple JSON file-based high score persistence.
 *
 * GET  /scores.php         → Returns top 10 scores
 * POST /scores.php         → Submits a new score, returns updated top 10
 *   Body: { "initials": "ABC", "score": 85, "rank": "Pathfinder" }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
$scoresFile = $dataDir . '/scores.json';
$maxScores = 50; // Keep top 50 in file, serve top 10

// Ensure data directory exists
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0777, true);
}

// Initialize scores file if missing
if (!file_exists($scoresFile)) {
    file_put_contents($scoresFile, json_encode(['scores' => []], JSON_PRETTY_PRINT));
    chmod($scoresFile, 0666);
}

/**
 * Load scores from file with file locking.
 */
function loadScores($file) {
    $handle = fopen($file, 'r');
    if (!$handle) return ['scores' => []];
    flock($handle, LOCK_SH);
    $content = stream_get_contents($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    $data = json_decode($content, true);
    return is_array($data) && isset($data['scores']) ? $data : ['scores' => []];
}

/**
 * Save scores to file with exclusive locking.
 */
function saveScores($file, $data) {
    $handle = fopen($file, 'c');
    if (!$handle) return false;
    flock($handle, LOCK_EX);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    return true;
}

/**
 * Validate and sanitize initials: 3 uppercase alpha characters.
 */
function sanitizeInitials($raw) {
    $clean = strtoupper(preg_replace('/[^a-zA-Z]/', '', $raw));
    return strlen($clean) >= 3 ? substr($clean, 0, 3) : null;
}

// Valid rank names
$validRanks = ['Frame-Locked', 'Investigator', 'Wayfinder', 'Pathfinder'];

// ── GET: Fetch leaderboard ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = loadScores($scoresFile);
    usort($data['scores'], fn($a, $b) => $b['score'] <=> $a['score'] ?: strcmp($a['timestamp'], $b['timestamp']));
    $top10 = array_slice($data['scores'], 0, 10);
    echo json_encode([
        'scores' => $top10,
        'total'  => count($data['scores']),
    ]);
    exit;
}

// ── POST: Submit a score ────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON body']);
        exit;
    }

    // Validate initials
    $initials = sanitizeInitials($input['initials'] ?? '');
    if (!$initials) {
        http_response_code(400);
        echo json_encode(['error' => 'Initials must be 3 letters']);
        exit;
    }

    // Validate score
    $score = filter_var($input['score'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0, 'max_range' => 100]
    ]);
    if ($score === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Score must be 0-100']);
        exit;
    }

    // Validate rank
    $rank = $input['rank'] ?? '';
    if (!in_array($rank, $validRanks, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid rank']);
        exit;
    }

    // Build entry
    $entry = [
        'initials'  => $initials,
        'score'     => $score,
        'rank'      => $rank,
        'timestamp' => gmdate('c'),
    ];

    // Load, append, sort, trim, save
    $data = loadScores($scoresFile);
    $data['scores'][] = $entry;
    usort($data['scores'], fn($a, $b) => $b['score'] <=> $a['score'] ?: strcmp($a['timestamp'], $b['timestamp']));
    $data['scores'] = array_slice($data['scores'], 0, $maxScores);
    saveScores($scoresFile, $data);

    // Determine player's position
    $position = 0;
    foreach ($data['scores'] as $i => $s) {
        if ($s['timestamp'] === $entry['timestamp'] && $s['initials'] === $entry['initials'] && $s['score'] === $entry['score']) {
            $position = $i + 1;
            break;
        }
    }

    $top10 = array_slice($data['scores'], 0, 10);
    echo json_encode([
        'scores'   => $top10,
        'total'    => count($data['scores']),
        'position' => $position,
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
