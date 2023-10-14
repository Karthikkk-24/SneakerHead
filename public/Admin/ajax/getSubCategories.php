<?php

include '../config/conn.php';

$getCategories = "SELECT * FROM tbl_subcategory";

$result = $pdo->query($getCategories);


$subCategoryData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $category_id = $row['category_id'];
        $getCategoryName = "SELECT * FROM tbl_category WHERE id = '$category_id'";
        $stmt = $pdo->query($getCategoryName);
        $categoryName = $stmt->fetch(PDO::FETCH_ASSOC);

        $subCategoryData[] = [
            'count' => $counter,
            'id' => $row['id'],
            'category_name' => $categoryName['category_name'],
            'subcategory_name' => $row['subcategory_name'],  
            'updated_at' => $row['updated_at']    
        ];
        $counter++;
    }

    echo json_encode($subCategoryData);
}

?>