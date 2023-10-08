<?php

session_start();

if ($_SESSION['loggedIn'] == true) {
    header("Location: pages/dashboard.php");
} else {
    header("Location: pages/login.php");
}

?>