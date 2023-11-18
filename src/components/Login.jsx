import React from 'react';
import "../assets/css/login.css";

export default function Login() {
  return (
    <div className='main_login_container'>
      <div className="login_container">
        <div className="login_image">
            <div className="overlay">
                <div className="heading">Don't Have an Account?</div>
                <div className="para">If you don't have an account, you can click the button below for quick registration.</div>
                <br />
                <button className="custom_btn" id="btn_register">Sign Up</button>
            </div>
        </div>
        <div className="login_box"></div>
      </div>
    </div>
  )
}
