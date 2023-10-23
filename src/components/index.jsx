import "../assets/css/index.css";

import React, { useEffect, useState } from "react";


export default function Index() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/fetch-banner-data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data[0]);
        console.log(data[0]['banner_image']);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const bannerContainer = document.getElementById("bannerContainer");
      bannerContainer.style.backgroundImage = `url(${data[0]["banner_location"]})`;
    }
  }, [data, loading]);

  return (
    <>
      <div className="main_container">
        <div className="header">
          <div className="container" id="bannerContainer">
            <div className="navbar">
              <div className="left">
                <div className="logo"></div>
                <div className="menu">
                  <span>Categories</span>
                  <span>Specials</span>
                  <span>Upcoming</span>
                  <span>Contact</span>
                  <span>About</span>
                </div>
              </div>
              <div className="right">
                <div className="profile">
                  <span>
                    <a href="pages/login.php">Login</a>
                  </span>
                  <div className="icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="overlay"></div>
            <div className="left"></div>
            <div className="right"></div>
          </div>
        </div>
        <div className="content">
          <div className="container">
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Featured Products</h2>
              </div>
              <div className="card_body">
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Specials</h2>
              </div>
              <div className="card_body">
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Popular Products</h2>
              </div>
              <div className="card_body">
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Latest Products</h2>
              </div>
              <div className="card_body">
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
                <div className="card">
                  <div className="overlay"></div>
                </div>
              </div>
            </div>
            <div className="top_deals_section">
              <div className="top_deals">
                <div className="top_deals_heading">
                  <h2>Top Deals</h2>
                </div>
                <div className="top_deals_content">
                  <div className="card"></div>
                  <div className="card"></div>
                  <div className="card"></div>
                  <div className="card"></div>
                  <div className="card"></div>
                  <div className="card"></div>
                </div>
              </div>
              <div className="top_deals_banner"></div>
            </div>
          </div>
        </div>
        <div className="footer"></div>
      </div>
    </>
  );
}