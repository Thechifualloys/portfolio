<?php
require __DIR__ . '/auth.php';
require_login();
require __DIR__ . '/../db.php';

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = (string)($_POST['csrf_token'] ?? '');
    if (!hash_equals($_SESSION['csrf_token'], $token)) {
        http_response_code(403);
        exit('Invalid request.');
    }

    $pdo = get_db();
    $id = (int)($_POST['id'] ?? 0);
    $action = (string)($_POST['action'] ?? '');

    if ($id > 0 && $action === 'mark_read') {
        $pdo->prepare('UPDATE messages SET is_read = 1 WHERE id = ?')->execute([$id]);
    } elseif ($id > 0 && $action === 'mark_unread') {
        $pdo->prepare('UPDATE messages SET is_read = 0 WHERE id = ?')->execute([$id]);
    } elseif ($id > 0 && $action === 'delete') {
        $pdo->prepare('DELETE FROM messages WHERE id = ?')->execute([$id]);
    }

    header('Location: messages.php');
    exit;
}

$pdo = get_db();
$messages = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC')->fetchAll();
$unreadCount = count(array_filter($messages, fn($m) => !$m['is_read']));
$csrf = htmlspecialchars($_SESSION['csrf_token']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Messages — Chiflloy Admin</title>
    <link rel="stylesheet" href="admin.css">
    <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
</head>
<body>
    <header class="admin-header">
        <div class="brand">&gt;_ Chif<span>lloy</span> Admin</div>
        <nav>
            <a href="../index.html">View site</a>
            <a href="logout.php">Log out</a>
        </nav>
    </header>

    <div class="admin-wrap">
        <h1>Contact Messages</h1>
        <p class="admin-sub"><?= count($messages) ?> total &middot; <?= $unreadCount ?> unread</p>

        <?php if (!$messages): ?>
            <div class="empty-state">No messages yet.</div>
        <?php endif; ?>

        <?php foreach ($messages as $m): ?>
            <div class="msg-card <?= $m['is_read'] ? '' : 'unread' ?>">
                <div class="msg-top">
                    <div>
                        <span class="msg-name"><?= htmlspecialchars($m['name']) ?></span>
                        &nbsp;&middot;&nbsp;
                        <span class="msg-email"><?= htmlspecialchars($m['email']) ?></span>
                    </div>
                    <div>
                        <?php if (!$m['is_read']): ?><span class="badge-unread">New</span><?php endif; ?>
                        <span class="msg-date"><?= htmlspecialchars(date('M j, Y g:ia', strtotime($m['created_at']))) ?></span>
                    </div>
                </div>
                <div class="msg-body"><?= nl2br(htmlspecialchars($m['message'])) ?></div>
                <div class="msg-actions">
                    <a href="mailto:<?= htmlspecialchars($m['email']) ?>" class="reply-link">Reply by email</a>
                    <form method="post" style="display:inline">
                        <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                        <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                        <input type="hidden" name="action" value="<?= $m['is_read'] ? 'mark_unread' : 'mark_read' ?>">
                        <button type="submit"><?= $m['is_read'] ? 'Mark unread' : 'Mark read' ?></button>
                    </form>
                    <form method="post" style="display:inline" class="delete-form">
                        <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                        <input type="hidden" name="id" value="<?= (int)$m['id'] ?>">
                        <input type="hidden" name="action" value="delete">
                        <button type="submit" class="danger">Delete</button>
                    </form>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <script>
        // Two-step delete confirmation, in-page — no blocking browser dialogs.
        document.querySelectorAll('.delete-form').forEach((form) => {
            const btn = form.querySelector('button');
            const original = btn.textContent;
            let confirming = false;
            let revertTimer;

            form.addEventListener('submit', (e) => {
                if (!confirming) {
                    e.preventDefault();
                    confirming = true;
                    btn.textContent = 'Confirm delete?';
                    revertTimer = setTimeout(() => {
                        confirming = false;
                        btn.textContent = original;
                    }, 3000);
                } else {
                    clearTimeout(revertTimer);
                }
            });
        });
    </script>
</body>
</html>
