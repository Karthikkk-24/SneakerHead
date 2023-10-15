<?php

include '../config/conn.php';

$getProducts = "SELECT * FROM `tbl_banner`";

$result = $pdo->query($getProducts);


$BannerData = [];
$counter = 1;

if ($result->rowCount() > 0) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $banner_id = $row['id'];
        $banner_image = $row['banner_image'];
        $banner_location = $row['banner_location'];
        $updated_at = $row['updated_at'];

        $BannerData[] = [
            'count' => $counter,
            'id' => $banner_id,
            'banner_image' => $banner_image,
            'banner_location' => $banner_location,
            'updated_at' => $updated_at
        ];

        $counter++;
    }

    echo json_encode($BannerData);
} else {
    echo json_encode([]);
}

?>