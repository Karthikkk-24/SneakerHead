<?php

session_start();

if ($_SESSION['loggedIn'] == true) {
    echo "You are logged in!";
} else {
    header("Location: pages/login.php");
}

?>