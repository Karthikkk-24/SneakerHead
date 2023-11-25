import "../assets/css/index.css";

import React, { useEffect, useState } from "react";
import Card from "./Card";

import { Link, BrowserRouter as Router } from "react-router-dom";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";

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
        console.log(data[0]["banner_image"]);
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
                    <Link to="/login">Login</Link>
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
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Specials</h2>
              </div>
              <div className="card_body">
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Popular Products</h2>
              </div>
              <div className="card_body">
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
              </div>
            </div>
            <div className="horizontal_cards">
              <div className="card_heading">
                <h2>Latest Products</h2>
              </div>
              <div className="card_body">
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
                <Card title="" />
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
            <div className="three_grid_Section">
              <div className="grid grid1">
                <div className="grid_header">
                  <h2 className="heading">Suggested for YOU</h2>
                </div>
                <div className="grid_body">
                  <div className="item item1"></div>
                  <div className="item item2"></div>
                  <div className="item item3"></div>
                </div>
                <div className="grid_footer">
                  <span className="view_more">View More</span>
                </div>
              </div>
              <div className="grid grid1">
                <div className="grid_header">
                  <h2 className="heading">Recommended Items</h2>
                </div>
                <div className="grid_body">
                  <div className="item item1"></div>
                  <div className="item item2"></div>
                  <div className="item item3"></div>
                </div>
                <div className="grid_footer">
                  <span className="view_more">View More</span>
                </div>
              </div>
              <div className="grid grid2">
                <div className="grid_header">
                  <h2 className="heading">Top Selection</h2>
                  <span className="more">
                    <i className="fa-solid fa-angle-right"></i>
                  </span>
                </div>
                <div className="grid_body">
                  <div className="item item1"></div>
                  <div className="item item2"></div>
                  <div className="item item4"></div>
                  <div className="item item3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer_container">
          <div className="footer_section">
            <div className="grid grid1">
              <div className="footer_heading">Heading 1</div>
              <div className="footer_body">
                <span>Content 1</span>
                <span>Content 2</span>
                <span>Content 3</span>
                <span>Content 4</span>
              </div>
            </div>
            <div className="grid grid2">
              <div className="footer_heading">Heading 2</div>
              <div className="footer_body">
                <span>Content 1</span>
                <span>Content 2</span>
                <span>Content 3</span>
                <span>Content 4</span>
              </div>
            </div>
            <div className="grid grid3">
              <div className="footer_heading">Heading 3</div>
              <div className="footer_body">
                <span>Content 1</span>
                <span>Content 2</span>
                <span>Content 3</span>
                <span>Content 4</span>
              </div>
            </div>
            <div className="grid grid4">
              <div className="footer_heading">Heading 4</div>
              <div className="footer_body">
                <span>Content 1</span>
                <span>Content 2</span>
                <span>Content 3</span>
                <span>Content 4</span>
              </div>
            </div>
          </div>
          <div className="footer">
            <span>&copy; 2023-2024 Karthik Shettigar (The Coding Hacker)</span>
          </div>
        </div>
      </div>
    </>
  );
}
