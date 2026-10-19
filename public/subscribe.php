<?php
declare(strict_types=1);

// Stores launch-list sign-ups outside the public web root:
// /var/www/<domain>/public/subscribe.php -> /var/www/<domain>/data/subscribers.csv
const MAX_SUBSCRIBERS = 50000;
const THROTTLE_SECONDS = 10;

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, string $error = '', int $status = 200): never
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $error]);
    } else {
        header('Location: /?subscribed=' . ($ok ? '1' : '0'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'method', 405);
}

// Bots fill the hidden field; pretend success so they move on.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(true);
}

$email = strtolower(trim((string) ($_POST['email'] ?? '')));
// A leading = + or - would be read as a formula if the CSV is opened in a spreadsheet.
if (strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false || preg_match('/^[=+\-]/', $email)) {
    respond(false, 'invalid', 422);
}
$lang = ($_POST['lang'] ?? 'en') === 'es' ? 'es' : 'en';

$dataDir = dirname(__DIR__) . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0700, true) && !is_dir($dataDir)) {
    error_log('deneb-site: cannot create data directory');
    respond(false, 'server', 500);
}

// Light per-address throttle; only a hash of the address is kept on disk.
$throttleDir = $dataDir . '/throttle';
if (!is_dir($throttleDir)) {
    @mkdir($throttleDir, 0700);
}
$throttleFile = $throttleDir . '/' . hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
if (is_file($throttleFile) && time() - (int) filemtime($throttleFile) < THROTTLE_SECONDS) {
    respond(false, 'throttled', 429);
}
@touch($throttleFile);

$file = $dataDir . '/subscribers.csv';
$handle = fopen($file, 'c+');
if ($handle === false || !flock($handle, LOCK_EX)) {
    error_log('deneb-site: cannot open subscribers file');
    respond(false, 'server', 500);
}

$count = 0;
rewind($handle);
while (($row = fgetcsv($handle, 0, ',', '"', '')) !== false) {
    if (($row[1] ?? null) === $email) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(true); // Already subscribed; don't reveal it.
    }
    $count++;
}
if ($count >= MAX_SUBSCRIBERS) {
    flock($handle, LOCK_UN);
    fclose($handle);
    respond(false, 'server', 503);
}

fseek($handle, 0, SEEK_END);
fputcsv($handle, [gmdate('c'), $email, $lang], ',', '"', '');
fflush($handle);
flock($handle, LOCK_UN);
fclose($handle);
@chmod($file, 0600);

respond(true);
