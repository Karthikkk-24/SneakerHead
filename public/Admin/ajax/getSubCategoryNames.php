<?php

include '../config/conn.php';

$category_id = $_POST['category_id'];

$getSubCategory = "SELECT * FROM `tbl_subcategory` WHERE category_id = '$category_id'";

$runSubCategory = $pdo->prepare($getSubCategory);

$runSubCategory->execute();

$subCategory = [];

if ($runSubCategory->rowCount() > 0) {
    while ($row = $runSubCategory->fetch(PDO::FETCH_ASSOC)) {
        $subCategory[] = [
            'id' => $row['id'],
            'sub_category_name' => $row['subcategory_name']
        ];
    }

    echo json_encode($subCategory);
} else {
    echo json_encode([]);
}

?>