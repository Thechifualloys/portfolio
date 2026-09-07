<?php
require __DIR__ . '/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// Honeypot: real users never fill this hidden field.
if (!empty($input['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

$name = trim((string)($input['name'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$message = trim((string)($input['message'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > 120) {
    $errors[] = 'Please enter your name.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    $errors[] = 'Please enter a valid email address.';
}
if ($message === '' || mb_strlen($message) < 10) {
    $errors[] = 'Message should be at least 10 characters.';
}
if (mb_strlen($message) > 5000) {
    $errors[] = 'Message is too long.';
}

if ($errors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'error' => implode(' ', $errors)]);
    exit;
}

try {
    $pdo = get_db();
    $stmt = $pdo->prepare(
        'INSERT INTO messages (name, email, message, ip_address) VALUES (:name, :email, :message, :ip)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);

    echo json_encode(['success' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Something went wrong. Please try again or email me directly.']);
}
