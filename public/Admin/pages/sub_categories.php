<?php $pageTitle = 'Sub Category'; ?>
<?php include '../include/header.php' ?>

<?php

if (isset($_POST['submit'])) {
    $category_id = $_POST['category_id'];
    $subcategory_name = $_POST['subcategory_name'];
    $currentDateTime = date('Y-m-d H:i:s');

    $addSubCategory = "INSERT INTO tbl_subcategory (category_id, subcategory_name, updated_at) VALUES (:category_id, :subcategory_name, :updated_at)";

    $stmt = $pdo->prepare($addSubCategory);

    $stmt->bindParam(':category_id', $category_id);
    $stmt->bindParam(':subcategory_name', $subcategory_name);
    $stmt->bindParam(':updated_at', $currentDateTime);

    $stmt->execute();

    header("Location: sub_categories.php");
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
                            <h1 class="m-0">Sub Category</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="dashboard.php">Home</a></li>
                                <li class="breadcrumb-item active">Sub Category</li>
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
                                <h3 class="card-title">Create Sub Category</h3>
                            </div>
                            <div class="card-body">
                                <form action="" class="row" method="POST">
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Select Category</label>
                                        <select class="form-control" id="categoryNames" name="category_id" required>
                                            <option value="">Select Category</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Sub Category Name</label>
                                        <input class="form-control" type="text" placeholder="Enter Sub Category Name" name="subcategory_name" id="" required>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" type="submit" name="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Sub Category List</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <th>Sr. No</th>
                                            <th>Category Name</th>
                                            <th>Sub Category</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody id="getSubCategoryData"></tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <br>
                </div><!--/. container-fluid -->
            </section>
            <!-- /.content -->
        </div>
        <?php include '../include/footer.php'; ?> 
        <!-- /.content-wrapper -->


        <script>
            const getSubCategoryData = document.getElementById('getSubCategoryData');
            const categoryNamesTag = document.getElementById('categoryNames');

            window.addEventListener('load', () => {
                categoryNames();
                fetchSubCategories();
            });

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

            function fetchSubCategories() {
                $.ajax({
                    url: '../ajax/getSubCategories.php',
                    type: 'POST',
                    success: function(response) {
                        // console.log(response);
                        const parsedResponse = JSON.parse(response);
                        console.log(parsedResponse);
                        getSubCategoryData.innerHTML = '';
                        for (let i = 0; i < parsedResponse.length; i++) {
                            getSubCategoryData.innerHTML += `
                                <tr>
                                    <td>${parsedResponse[i].count}</td>
                                    <td>${parsedResponse[i].category_name}</td>
                                    <td>${parsedResponse[i].subcategory_name}</td>
                                    <td><a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-primary"><i class="fa-solid fa-pen-to-square"></i></a>&emsp;<a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-danger"><i class="fa-solid fa-trash-can"></i></a></td>
                                </tr>`;
                        }
                    }
                })
            }
        </script>

</body>

</html>