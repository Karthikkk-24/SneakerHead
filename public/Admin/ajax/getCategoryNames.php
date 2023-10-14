<?php

include '../config/conn.php';

$getCategories = "SELECT id, category_name FROM tbl_category";

$result = $pdo->query($getCategories);



$categoryData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $categoryData[] = [
            'count' => $counter,
            'id' => $row['id'],
            'category_name' => $row['category_name']
        ];
        $counter++;
    }

    echo json_encode($categoryData);
}

?>