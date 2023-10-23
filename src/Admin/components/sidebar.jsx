import React from "react";

export default function sidebar() {
  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index.php" className="brand-link">
          <img
            src="../dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style="opacity: .8"
          />
          <span className="brand-text font-weight-light">Sneaker Head</span>
        </a>

        <div className="sidebar">
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="../dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                Admin
              </a>
            </div>
          </div>

          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw"></i>
                </button>
              </div>
            </div>
          </div>

          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <a
                  href="dashboard.php"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    Landing Page
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="banner.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Banner</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="specials.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Specials</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="contact.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Contact Details</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="about.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>About</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    Product Section
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="categories.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Categories</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="sub_categories.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Sub Categories</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="products.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Products</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="accessories.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Accessories</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    Order Management
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="orders.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Orders</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="coupons.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Coupons</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="average_order.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Average Order Details</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    User Management
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="users.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>User List</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="user_notification.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>User Notification</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item>">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    Link Management
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="footer.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Footer</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="social_media.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Social Media</p>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link"
                >
                  <i className="nav-icon fas fa-chart-pie"></i>
                  <p>
                    News Section
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <a
                      href="upcoming.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Upcoming</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="top_deals.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Top Deals</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="rating.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Ratings</p>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="best_sellers.php"
                      className="nav-link"
                    >
                      <i className="far fa-circle nav-icon"></i>
                      <p>Best Sellers</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
