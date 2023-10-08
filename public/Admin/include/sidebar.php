<!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="index.php" class="brand-link">
        <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light">Aaryansh Electricals</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block">Admin</a>
            </div>
        </div>

        <!-- SidebarSearch Form -->
        <div class="form-inline">
            <div class="input-group" data-widget="sidebar-search">
                <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
                <div class="input-group-append">
                    <button class="btn btn-sidebar">
                        <i class="fas fa-search fa-fw"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                <li class="nav-item">
                    <a href="index.php" class="nav-link <?php echo ($pageTitle === 'Aaryansh Electricals') ? 'active' : ''; ?>">
                        <i class="nav-icon fas fa-tachometer-alt"></i>
                        <p>
                            Dashboard
                        </p>
                    </a>

                </li>
                <li class="nav-item <?php echo ($pageTitle === 'Quotation | Aaryansh Electricals') || ($pageTitle === 'Purchase Order | Aaryansh Electricals') || ($pageTitle === 'Measurement | Aaryansh Electricals') || ($pageTitle === 'Billing | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-chart-pie"></i>
                        <p>
                            Sales & Procurement
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="quotation.php" class="nav-link <?php echo ($pageTitle === 'Quotation | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Quotation</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="purchase_order.php" class="nav-link <?php echo ($pageTitle === 'Purchase Order | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Purchase Order</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="measurement.php" class="nav-link <?php echo ($pageTitle === 'Measurement | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Measurement</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="billing.php" class="nav-link <?php echo ($pageTitle === 'Billing | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Billing</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item <?php echo ($pageTitle === 'Reports | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-chart-simple"></i>
                        <p>
                            Reporting & Analytics
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="reports.php" class="nav-link <?php echo ($pageTitle === 'Reports | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Report</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item <?php echo ($pageTitle === 'Converter | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-screwdriver-wrench"></i>
                        <p>
                            Utilities
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="converter.php" class="nav-link <?php echo ($pageTitle === 'Converter | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Converter</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item <?php echo ($pageTitle === 'HR | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-person"></i>
                        <p>
                            Human Resources
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="hr.php" class="nav-link <?php echo ($pageTitle === 'HR | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>HR</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item <?php echo ($pageTitle === 'Users | Aaryansh Electricals') || ($pageTitle === 'Roles | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-user"></i>
                        <p>
                            Users & Models
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="users.php" class="nav-link <?php echo ($pageTitle === 'Users | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Users</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="roles.php" class="nav-link <?php echo ($pageTitle === 'Roles | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Roles</p>
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="nav-item <?php echo ($pageTitle === 'Company Master | Aaryansh Electricals') || ($pageTitle === 'Product Master | Aaryansh Electricals') ? ' menu-is-opening menu-open' : ''; ?>">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa-solid fa-graduation-cap"></i>
                        <p>
                            Master Area
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="company_master.php" class="nav-link <?php echo ($pageTitle === 'Company Master | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Company Master</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="product_master.php" class="nav-link <?php echo ($pageTitle === 'Product Master | Aaryansh Electricals') ? 'active' : ''; ?>">
                                <i class="far fa-circle nav-icon"></i>
                                <p>Product Master</p>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>