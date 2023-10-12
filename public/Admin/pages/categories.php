<?php $pageTitle = 'Category'; ?>
<?php include '../include/header.php' ?>

<?php
$currentDateTime = date('Y-m-d H:i:s');

if (isset($_POST['submit'])) {
    $category_name = $_POST['category_name'];
    
    $addCategory = "INSERT INTO tbl_category (category_name, updated_at) VALUES (:category_name, :updated_at)";
    $stmt = $pdo->prepare($addCategory);

    $stmt->bindParam(':category_name', $category_name);
    $stmt->bindParam(':updated_at', $currentDateTime);

    $stmt->execute();
    
    header("Location: categories.php");
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
                            <h1 class="m-0">Category</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="dashboard.php">Home</a></li>
                                <li class="breadcrumb-item active">Category</li>
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
                                <h3 class="card-title">Create Category</h3>
                            </div>
                            <form action="" method="POST">
                                <div class="card-body">
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Category Name</label>
                                        <input class="form-control" type="text" placeholder="Enter Category Name" name="category_name" id="" required>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" type="submit" name="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Category List</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <th>Sr. No</th>
                                            <th>Category Name</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody></tbody>
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

</body>

</html>