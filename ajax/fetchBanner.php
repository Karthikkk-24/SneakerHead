<?php

include '../config/conn.php';

$sql = "SELECT * FROM tbl_banner ORDER BY id DESC";

$result = $pdo->query($sql);

if ($result->rowCount() > 0) {
    $data = $result->fetchAll();
    echo json_encode($data);
} else {
    echo json_encode([]);
}

?>