<?php

session_start();
include "../config/conn.php";
if (isset($_SESSION["loggedIn"])) {
    header("Location: ../index.php");
}


if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM admin WHERE username = :username AND password = :password";   
    $currentDateTime = date('Y-m-d H:i:s');
    
    try {
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $sql_2 = "UPDATE admin SET last_login = :last_login WHERE username = :username";
            $stmt_2 = $pdo->prepare($sql_2);

            $stmt_2->bindParam(':last_login', $currentDateTime);
            $stmt_2->bindParam(':username', $username);

            $stmt_2->execute();

            $_SESSION['loggedIn'] = true;           

            header("Location: ../index.php");

            exit();

        } else {
            // header("Location: login.php");

            exit();
        }
    } catch (PDOException $e) {
        // header("Location: login.php");

        exit();
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="stylesheet" href="../../assets/css/login.css">
</head>

<body>
    <div class="main_container">
        <div class="login">
            <form action="" method="POST">
                <div class="heading">
                    <!-- <h1>Login</h1> -->
                    <lottie-player src="https://assets8.lottiefiles.com/packages/lf20_2nfmti0q.json"
                        background="transparent" speed="0.6" style="width: 200px; height: 150px;" loop
                        autoplay></lottie-player>
                </div>
                <div class="form">
                    <div class="form_element">
                        <label for="username">Enter your username:</label>
                        <input type="text" name="username" required>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail" width="30"
                                height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <polyline points="3 7 12 13 21 7" />
                            </svg>
                        </div>
                    </div>
                    <div class="form_element">
                        <label for="password">Enter your password:</label>
                        <input type="password" name="password" required>
                        <div class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-lock" width="30"
                                height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <rect x="5" y="11" width="14" height="10" rx="2" />
                                <circle cx="12" cy="16" r="1" />
                                <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
                            </svg>
                        </div>

                    </div>
                    <div>
                        <button class="login_btn" name="login">Login</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
</body>

</html>