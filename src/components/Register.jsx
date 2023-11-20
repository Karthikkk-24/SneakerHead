import React from "react";

export default function Register() {
  const pinkColor = "#f9b4ed";
  const whiteColor = "#f6fff8";
  const mainColor = "#d90368";
  const overlayColor = "rgba(0, 0, 0, 0.5)";
  const blackColor = "#2e282a";

  const styles = {
    root: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: pinkColor,
    },
    loginContainer: {
      height: "70vh",
      width: "60vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "0.2vh solid lightgray",
      borderRadius: "5vh 0 5vh 0",
      overflow: "hidden",
      background: whiteColor,
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 2vh 10vh",
    },
    loginImage: {
      height: "100%",
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: 'url("public/assets/img/login/background.jpg")',
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    },
    overlay: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: overlayColor,
    },
    heading: {
      fontSize: "5vh",
      width: "70%",
      color: whiteColor,
    },
    para: {
      fontSize: "2vh",
      width: "70%",
      color: whiteColor,
    },
    customBtn: {
      color: whiteColor,
      textDecoration: "none",
      background: mainColor,
      border: "none",
      padding: "0 2vw",
      height: "6vh",
      borderRadius: "1.5vh",
      textTransform: "uppercase",
      fontSize: "2.2vh",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    loginBox: {
      height: "100%",
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingLeft: "5vw",
    },
    loginBoxContainer: {
        width: "80%",
        height: "80%",
    },
    customText: {
      color: mainColor,
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
    },
    mainHeading: {
      fontSize: "5vh",
      color: mainColor,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    subHeading: {
      fontSize: "2.2vh",
      color: blackColor,
      textTransform: "uppercase",
    },
    inputStyle: {
        width: "100%",
        height: "5vh",
        marginBottom:  "1vh",
        borderRadius: "1vh",
        border: "0.2vh solid lightgray",
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.loginContainer}>
        <div style={styles.loginImage}>
          <div style={styles.overlay}>
            <div style={styles.heading}>Don't Have an Account?</div>
            <div style={styles.para}>
              If you don't have an account, you can click the button below for
              quick registration.
            </div>
            <br />
            {/* <button style={styles.customBtn} id="btn_register"> */}
            <a style={styles.customBtn} id="btn_register" href="">
              Sign Up
            </a>
            {/* </button> */}
          </div>
        </div>
        <div style={styles.loginBox}>
          <div style={styles.loginBoxContainer}>
          <div style={styles.mainHeading}>Register</div>
          <div style={styles.subHeading}>Create a new account</div>
          <br />
          <br />
          <div style={styles.formGroup}>
            <label style={styles.labelStyle} htmlFor="">Username or Email</label>
            <input style={styles.inputStyle} type="text" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.labelStyle} htmlFor="">Password</label>
            <input style={styles.inputStyle} type="text" />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="">
              <input type="checkbox" name="" id="" />
              Remember Me
            </label>
          </div>
          <br />
          <br />
          <button style={styles.customBtn} id="btn_login">
            Log In
          </button>
          <br />
          <span>
            <a href="" style={styles.customText}>
              Forget Password?
            </a>
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}
