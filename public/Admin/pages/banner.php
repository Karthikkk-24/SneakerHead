<?php $pageTitle = 'Banner'; ?>
<?php include '../include/header.php' ?>

<?php

if (isset($_POST['submit'])) {
    $currentDateTime = date('Y-m-d');

    $filename = $_FILES['image']['name'];
    $tempname = $_FILES['image']['tmp_name'];
    $banner_location = 'uploads/banners/' . $filename;
    $file_location = '../../uploads/banners/' . $filename;

    move_uploaded_file($tempname, $file_location);

    $sql = "INSERT INTO tbl_banner (banner_image, banner_location, updated_at) VALUES (:file_name, :banner_location, :updated_at)";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':file_name', $filename);
    $stmt->bindParam(':banner_location', $banner_location);
    $stmt->bindParam(':updated_at', $currentDateTime);

    $stmt->execute();

    header("Location: banner.php");
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
                            <h1 class="m-0">Banner</h1>
                        </div><!-- /.col -->
                        <div class="col-sm-6">
                            <ol class="breadcrumb float-sm-right">
                                <li class="breadcrumb-item"><a href="dashboard.php">Home</a></li>
                                <li class="breadcrumb-item active">Banner</li>
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
                                <h3 class="card-title">Create Banner</h3>
                            </div>
                            <div class="card-body">
                                <form action="" class="row" method="POST" enctype="multipart/form-data">
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Image</label>
                                        <input class="form-control" type="file" name="image" id="" required>
                                    </div>
                                    <div class="col-md-12">
                                        <button class="btn btn-primary" type="submit" name="submit">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="card col-md-12">
                            <div class="card-header">
                                <h3 class="card-title">Banner List</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered table-hover">
                                        <thead>
                                            <th>Sr. No</th>
                                            <th>Image</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody id="banner_list"></tbody>
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
            const bannerList = document.getElementById('banner_list');

            window.addEventListener('load', () => {
                fetchBanners();
            });

            function fetchBanners() {
                $.ajax({
                    url: '../ajax/getBanners.php',
                    method: 'POST',
                    success: function(response) {
                        console.log(response);
                        const parsedResponse = JSON.parse(response);
                        for (let i = 0; i < parsedResponse.length; i++) {
                            bannerList.innerHTML += `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td><img style="width: 250px; height: auto;" src="../../uploads/banners/${parsedResponse[i].banner_image}" alt=""></td>
                                    <td>${parsedResponse[i].updated_at}</td>
                                    <td><a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-primary"><i class="fa-solid fa-pen-to-square"></i></a>&emsp;<a href="edit-category.php?id=${parsedResponse[i].id}" class="text text-danger"><i class="fa-solid fa-trash-can"></i></a></td>
                                </tr>`;
                        }
                    }
                });
            }
        </script>

</body>

</html>