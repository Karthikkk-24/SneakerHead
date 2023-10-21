<?php

include '../config/conn.php';

$getProducts = "SELECT * FROM `tbl_accessories`";

$result = $pdo->query($getProducts);


$AccessoriesData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $accessories_id = $row['id'];
        $product_id = $row['product_id'];
        $accessories_name = $row['accessories_name'];
        $accessories_price = $row['accessories_price'];

        $getProductName = "SELECT * FROM tbl_products WHERE id = '$product_id'";
        $productNameResult = $pdo->query($getProductName);

        if ($productNameResult->rowCount() > 0) {
            $productNameRow = $productNameResult->fetch(PDO::FETCH_ASSOC);
            $product_name = $productNameRow['product_name'];    
        }

        $AccessoriesData[] = [
            'count' => $counter,
            'id' => $accessories_id,
            'accessories_name' => $accessories_name,
            'product_name' => $product_name,
            'accessories_price' => $accessories_price
        ];

        $counter++;
    }

    echo json_encode($AccessoriesData);
} else {
    echo json_encode([]);
}

?>