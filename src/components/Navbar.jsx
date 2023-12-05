import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const pinkColor = "#f9b4ed";
  const whiteColor = "#f6fff8";
  const mainColor = "#d90368";
  const overlayColor = "rgba(0, 0, 0, 0.5)";
  const blackColor = "#2e282a";

  const styles = {
    navbar: {
      height: "10vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"
    },
    logo: {
      height: "100%",
      width: "15%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    navbar_nav: {
      width: "40%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    login: {
      width: "15%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      
    },
    profile: {
        border: `2px solid ${mainColor}`,
        background: `${whiteColor}`,
        height: "60%",
        borderRadius: "30px",
        width: "60%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px",
    },
    icon: {
        height: "100%",
        borderRadius: "50%",
        background: `${blackColor}`,
        width: "auto",
        aspectRatio: "1/1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
        color: `${whiteColor}`,
    },
    loginText: {
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        
    }
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.logo}></div>
      <div style={styles.navbar_nav}>
        <span>Home</span>
        <span>Categories</span>
        <span>Specials</span>
        <span>Upcoming</span>
        <span>Contact</span>
        <span>About</span>
      </div>
      <div style={styles.login}>
      <div style={styles.profile}>
            <span style={styles.loginText}>
                <Link to="/login">Login</Link>
            </span>
            <div style={styles.icon}>
            <i className="fa-solid fa-user"></i>
            </div>
        </div>
      </div>
    </div>
  );
}
