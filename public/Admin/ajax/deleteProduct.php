<?php

include '../config/conn.php';

if (isset($_POST['id'])) {
    $mainId = $_POST['id'];
    $sql = "DELETE FROM `tbl_products` WHERE id = $mainId";

    $result = $pdo->query($sql);
    
    if ($result->rowCount() > 0) {
        echo 'Success';
    } else {
        echo 'Failed';
    }
}

?>