<?php

include '../config/conn.php';

$getProducts = "SELECT * FROM `tbl_products`";

$result = $pdo->query($getProducts);


$ProductsData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $product_id = $row['id'];
        $product_name = $row['product_name'];

        $ProductsData[] = [
            'count' => $counter,
            'id' => $product_id,
            'product_name' => $product_name
        ];

        $counter++;
    }

    echo json_encode($ProductsData);
} else {
    echo json_encode([]);
}

?>