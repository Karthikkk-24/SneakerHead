<?php $pageTitle = 'Sub Category'; ?>
<?php include '../include/header.php' ?>

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
                                        <select class="form-control" name="category_id" required>
                                            <option value="">Select Category</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 form-group">
                                        <label class="form-label" for="">Sub Category Name</label>
                                        <input class="form-control" type="text" placeholder="Enter Sub Category Name" name="sub_category_name" id="" required>
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
                                        <tbody id="getSubCategoryData"></tbody></tbody>
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
            const getSubCategoryData = document.getElementById('getSubCategoryData');
            window.addEventListener('load', () => {
                getCategories();
            });

            function getCategories() {
                $.ajax({
                    url: '../ajax/getSubCategories.php',
                    type: 'POST',
                    success: function(response) {
                        console.log(response);
                        const parsedResponse = JSON.parse(response);
                        console.log(parsedResponse);
                        getCategoryData.innerHTML = '';
                        for (let i = 0; i < parsedResponse.length; i++) {
                            getCategoryData.innerHTML += `
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