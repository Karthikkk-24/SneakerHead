<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "sneakerhead_db";

date_default_timezone_set('Asia/Kolkata');


try {
    
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);

    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    

    
} catch (PDOException $e) {
    header("Location: login.php");
}
?>
