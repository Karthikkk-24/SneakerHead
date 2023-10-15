<?php $pageTitle = 'Accessories'; ?>
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

        <script>
            const getProductDataTag = document.getElementById('getProductData');

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

            }
        </script>

</body>

</html>