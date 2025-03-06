<?php
$filename = __DIR__ . "/../count.txt";
if (!file_exists($filename)) {
    file_put_contents($filename, "0");
}

$count = intval(trim(file_get_contents($filename))) + 1;
file_put_contents($filename, $count);

header('Content-Type: application/json');
echo json_encode(['count' => $count]);
?> 