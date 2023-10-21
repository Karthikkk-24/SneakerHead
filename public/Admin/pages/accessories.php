<?php $pageTitle = 'Accessories'; ?>
<?php include '../include/header.php' ?>

<?php

if (isset($_POST['submit'])) {
    $currentDateTime = date('Y-m-d H:i:s');
    $product_id = $_POST['product_id'];
    $accessories_name = $_POST['accessories_name'];
    $accessories_price = $_POST['accessories_price'];

    $insertAccessories = "INSERT INTO tbl_accessories (product_id, accessories_name, accessories_price, created_at) VALUES (:product_id, :accessories_name, :accessories_price, :updated_at)";
    
    $stmt = $pdo->prepare($insertAccessories);

    $stmt->bindParam(':product_id', $product_id);
    $stmt->bindParam(':accessories_name', $accessories_name);
    $stmt->bindParam(':accessories_price', $accessories_price);
    $stmt->bindParam(':updated_at', $currentDateTime);

    $stmt->execute();

    header("Location: accessories.php");
    exit();
}

?>

<body class="hold-transition dark-mode sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed">
    <div class="wrapper">


        <?php include '../include/preloader.php'; ?>

        <?php include '../include/navbar.php'; ?>

        <?php include '../include/sidebar.php'; ?>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <h1 class="m-0">Accessories</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="dashboard.php">Home</a></li>
                                <li class="breadcrumb-item active">Accessories</li>
                            </ol>
                        </div><!-- /.col -->
                    </div><!-- /.row -->
                </div><!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->

            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <div class="row">
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Create Accessories</h3>
                            </div>
                            <div class="card-body">
                                <form action="" class="row" method="POST">
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Select Product</label>
                                        <select class="form-control" name="product_id" id="getProductData" required>
                                            <option value="">Select Product</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Accessories</label>
                                        <input class="form-control" type="text" placeholder="Enter Accessories Name" name="accessories_name" id="" required>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Price</label>
                                        <input class="form-control" type="number" placeholder="Enter Price" name="accessories_price" id="" required>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" type="submit" name="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Accessories List</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <th>Sr. No</th>
                                            <th>Product Name</th>
                                            <th>Accessories</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody id="accessories_list"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!--/. container-fluid -->
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->

        <?php include '../include/footer.php'; ?>

        <script>
            const getProductDataTag = document.getElementById('getProductData');
            const accessoriesList = document.getElementById('accessories_list');

            window.addEventListener('load', () => {
                fetchProducts();
                fetchAccessories();
            });

            function fetchProducts() {
                $.ajax({
                    url: '../ajax/getProducts.php',
                    type: 'POST',
                    success: function(response) {
                        const parsedResponse = JSON.parse(response);
                        for (let i = 0; i < parsedResponse.length; i++) {
                            getProductDataTag.innerHTML += `
                                <option value="${parsedResponse[i].id}">${parsedResponse[i].product_name}</option>`;
                        }
                    }
                })
            }

            function fetchAccessories() {
                $.ajax({
                    url: '../ajax/getAccessories.php',
                    type: 'POST',
                    success: function(response) {
                        const parsedResponse = JSON.parse(response);
                        for (let i = 0; i < parsedResponse.length; i++) {
                            accessoriesList.innerHTML += `
                                <tr>
                                    <td>${parsedResponse[i].count}</td>
                                    <td>${parsedResponse[i].product_name}</td>
                                    <td>${parsedResponse[i].accessories_name}</td>
                                    <td>${parsedResponse[i].accessories_price}</td>
                                    <td><a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-primary"><i class="fa-solid fa-pen-to-square"></i></a>&emsp;<a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-danger"><i class="fa-solid fa-trash-can"></i></a></td>
                                </tr>`;
                        }
                    }
                })
            }
        </script>

</body>

</html>