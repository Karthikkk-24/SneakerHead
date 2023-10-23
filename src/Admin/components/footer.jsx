import React from "react";

export default function footer() {
  return (
    <>
      <div>
        <footer className="main-footer">
          <strong>
            Copyright &copy; 2014-2021{" "}
            <a target="_blank" href="">
              Karthik Shettigar (the Coding Hacker)
            </a>
            .
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 3.2.0
          </div>
        </footer>
      </div>

      <script src="../plugins/jquery/jquery.min.js"></script>

      <script src="../plugins/bootstrap/js/bootstrap.bundle.min.js"></script>

      <script src="../plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>

      <script src="../dist/js/adminlte.js"></script>

      <script src="../plugins/jquery-mousewheel/jquery.mousewheel.js"></script>
      <script src="../plugins/raphael/raphael.min.js"></script>
      <script src="../plugins/jquery-mapael/jquery.mapael.min.js"></script>
      <script src="../plugins/jquery-mapael/maps/usa_states.min.js"></script>
      <script src="../plugins/chart.js/Chart.min.js"></script>
    </>
  );
}
