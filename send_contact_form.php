<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'contact_form_errors.log');

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';
if (!preg_match('/^[a-z0-9.\-\[\]:]+$/i', $host)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Некорректный адрес сайта.']);
    exit;
}
$same_origin = $scheme . '://' . $host;
$origin = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');
if ($origin !== '' && !hash_equals($same_origin, $origin)) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Источник запроса не разрешен.']);
    exit;
}
if ($origin !== '') {
    header('Access-Control-Allow-Origin: ' . $same_origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Ожидается POST-запрос.']);
    exit;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'contact_rate_' . hash('sha256', $ip) . '.json';
$now = time();
$attempts = is_file($rate_file) ? json_decode((string) @file_get_contents($rate_file), true) : [];
$attempts = is_array($attempts) ? $attempts : [];
$attempts = array_values(array_filter($attempts, static function ($timestamp) use ($now) {
    return is_int($timestamp) && $timestamp > $now - 600;
}));
if (count($attempts) >= 10) {
    http_response_code(429);
    echo json_encode(['status' => 'error', 'message' => 'Слишком много запросов. Попробуйте позже.']);
    exit;
}
$attempts[] = $now;
@file_put_contents($rate_file, json_encode($attempts), LOCK_EX);

if (!empty($_POST['website'])) {
    echo json_encode(['status' => 'success', 'message' => 'Спасибо! Сообщение отправлено.']);
    exit;
}

$recipient_email = 'Ivan261223@yandex.ru';
$name = trim($_POST['name'] ?? '');
$user_email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$consent = $_POST['consent'] ?? '';

$length = static function ($value) {
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
};
if (!filter_var($recipient_email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Email получателя не настроен.']);
    exit;
}
if ($name === '' || $user_email === '' || $message === '' || $consent !== 'on') {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Заполните поля и подтвердите согласие.']);
    exit;
}
if (!filter_var($user_email, FILTER_VALIDATE_EMAIL) || $length($name) > 120 || $length($message) > 5000) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Проверьте введенные данные.']);
    exit;
}

$safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safe_email = htmlspecialchars($user_email, ENT_QUOTES, 'UTF-8');
$safe_message = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
$server_name = preg_replace('/[^a-z0-9.-]/i', '', strtolower($_SERVER['SERVER_NAME'] ?? 'localhost'));
$from_email = 'no-reply@' . ($server_name ?: 'localhost');
$subject = 'Новое сообщение с сайта';
$body = "<html><body><h2>Новое сообщение с сайта</h2><p><strong>Имя:</strong> {$safe_name}</p><p><strong>Email:</strong> {$safe_email}</p><hr><p>{$safe_message}</p></body></html>";
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$from_email}\r\n";
$headers .= "Reply-To: {$user_email}\r\n";

if (@mail($recipient_email, $subject, $body, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'Спасибо! Сообщение отправлено.']);
    exit;
}

error_log('Contact form: mail() returned false.');
http_response_code(500);
echo json_encode(['status' => 'error', 'message' => 'Сервер не смог отправить сообщение.']);
