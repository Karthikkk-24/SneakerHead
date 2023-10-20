<?php $pageTitle = 'Products'; ?>
<?php include '../include/header.php' ?>

<?php

if (isset($_POST['submit'])) {

    $filename = $_FILES['product_image']['name'];
    $tempname = $_FILES['product_image']['tmp_name'];
    $product_location = 'uploads/products/' . $filename;
    $file_location = '../../uploads/products/' . $filename;

    move_uploaded_file($tempname, $file_location);


    $currentDateTime = date('Y-m-d H:i:s');

    $category_id = $_POST['category_id'];
    $subcategory_id = $_POST['subcategory_id'];
    $product_name = $_POST['product_name'];

    $addProduct = "INSERT INTO tbl_products (category_id, subcategory_id, product_name, product_image, product_location, updated_at) VALUES (:category_id, :subcategory_id, :product_name, :file_name, :product_location, :updated_at)";

    $stmt = $pdo->prepare($addProduct);

    $stmt->bindParam(':category_id', $category_id); 
    $stmt->bindParam(':subcategory_id', $subcategory_id);
    $stmt->bindParam(':product_name', $product_name);
    $stmt->bindParam(':file_name', $filename);
    $stmt->bindParam(':product_location', $product_location);
    $stmt->bindParam(':updated_at', $currentDateTime);

    $stmt->execute();

    header("Location: products.php");
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
                            <h1 class="m-0">Products</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="dashboard.php">Home</a></li>
                                <li class="breadcrumb-item active">Products</li>
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
                                <h3 class="card-title">Create Product</h3>
                            </div>
                            <div class="card-body">
                                <form action="" class="row" method="POST" enctype="multipart/form-data">
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Select Category</label>
                                        <select class="form-control" id="categoryNames" name="category_id" required>
                                            <option value="">Select Category</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Select Sub Category</label>
                                        <select class="form-control" id="subCategoryNames" name="subcategory_id" required>
                                            <option value="">Select Sub Category</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="productName">Product Name</label>
                                        <input class="form-control" type="text" placeholder="Enter Product Name" name="product_name" id="productName" required>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label for="productImage" class="form-label">Product Image</label>
                                        <input type="file" name="product_image" id="productImage" class="form-control" required>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" type="submit" name="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Product List</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <th>Sr. No</th>
                                            <th>Category Name</th>
                                            <th>Sub Category Name</th>
                                            <th>Product Name</th>
                                            <th>Product Image</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody id="getProductData"></tbody>
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
            const categoryNamesTag = document.getElementById('categoryNames');
            const subCategoryNamesTag = document.getElementById('subCategoryNames');
            const getProductData = document.getElementById('getProductData');

            window.addEventListener('load', () => {
                categoryNames();
                fetchProductData();
            });

            categoryNamesTag.addEventListener('change', () => {
                subCategoryNamesTag.innerHTML = '';
                subCategoryNames();
            });

            function fetchProductData() {
                $.ajax({
                    url: '../ajax/getProductData.php',
                    type: 'POST',
                    success: function(response) {
                        const parsedResponse = JSON.parse(response);
                        getProductData.innerHTML = '';
                        for (let i = 0; i < parsedResponse.length; i++) {
                            
                            getProductData.innerHTML += `
                                <tr>
                                    <td>${parsedResponse[i].count}</td>
                                    <td>${parsedResponse[i].category_name}</td>
                                    <td>${parsedResponse[i].subcategory_name}</td>
                                    <td>${parsedResponse[i].product_name}</td>
                                    <td><img style="width: 200px; height: 200px;" src="../../${parsedResponse[i].product_location}" /></td>
                                    <td><a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-primary"><i class="fa-solid fa-pen-to-square"></i></a>&emsp;<a onclick="deleteProduct('${parsedResponse[i].id}')" class="text text-danger"><i class="fa-solid fa-trash-can"></i></a></td>
                                </tr>`;
                        }
                    }
                });
            }

            function deleteProduct(id) {
                if (confirm('Do you wish to delete this product?')) {
                    $.ajax({
                        url: '../ajax/deleteProduct.php',
                        type: 'POST',
                        data: {
                            id: id
                        },
                        success: function(response) {
                            if (response === 'Success') {
                                window.location.reload();
                            } else {
                                return false;
                            }
                        }
                    })
                } else {
                    return false;
                }
            }

            function categoryNames() {
                $.ajax({
                    url: '../ajax/getCategoryNames.php',
                    type: 'POST',
                    success: function(response) {
                        const parsedResponse = JSON.parse(response);
                        for (let i = 0; i < parsedResponse.length; i++) {
                            categoryNamesTag.innerHTML += `
                                <option value="${parsedResponse[i].id}">${parsedResponse[i].category_name}</option>`
                        }
                    }
                });
            }

            function subCategoryNames() {
                $.ajax({
                    url: '../ajax/getSubCategoryNames.php',
                    type: 'POST',
                    data: {
                        category_id: categoryNamesTag.value
                    },
                    success: function(response) {
                        const parsedResponse = JSON.parse(response);
                        for (let i = 0; i < parsedResponse.length; i++) {
                            subCategoryNamesTag.innerHTML += `
                                <option value="${parsedResponse[i].id}">${parsedResponse[i].sub_category_name}</option>`;
                        }
                    }
                });
            }
        </script>
</body>

</html>