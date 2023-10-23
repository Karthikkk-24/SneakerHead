import React from "react";

export default function Header() {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sneaker Head | Dashboard</title>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
        />
        <script
          src="https://kit.fontawesome.com/f364b180c9.js"
          crossOrigin="anonymous"
        ></script>
        <link
          rel="stylesheet"
          href="../plugins/fontawesome-free/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="../plugins/overlayScrollbars/css/OverlayScrollbars.min.css"
        />
        <link rel="stylesheet" href="../dist/css/adminlte.min.css" />
        <link rel="stylesheet" href="../assets/css/style.css" />
        <script
          src="https://code.jquery.com/jquery-3.7.0.min.js"
          integrity="sha256-2Pmvv0kuTBOenSvLm6bvfBSSHrUJ+3A7x6P5Ebd07/g="
          crossOrigin="anonymous"
        ></script>
        <link
          href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
      </head>
    </>
  );
}
