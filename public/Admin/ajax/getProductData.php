<?php

include '../config/conn.php';

$getProducts = "SELECT * FROM tbl_products";

$result = $pdo->query($getProducts);


$ProductsData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $category_id = $row['category_id'];
        $subcategory_id = $row['subcategory_id'];

        $getCategoryName = "SELECT * FROM tbl_category WHERE id = '$category_id'";
        $stmt = $pdo->query($getCategoryName);
        $categoryName = $stmt->fetch(PDO::FETCH_ASSOC);

        $getSubCategoryName = "SELECT * FROM tbl_subcategory WHERE id = '$subcategory_id'";
        $stmt = $pdo->query($getSubCategoryName);
        $subCategoryName = $stmt->fetch(PDO::FETCH_ASSOC);

        $ProductsData[] = [
            'count' => $counter,
            'id' => $row['id'],
            'category_name' => $categoryName['category_name'],
            'subcategory_name' => $subCategoryName['subcategory_name'],  
            'product_name' => $row['product_name'],
            'updated_at' => $row['updated_at']    
        ];
        $counter++;
    }

    echo json_encode($ProductsData);
}

?>