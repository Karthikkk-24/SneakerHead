import React from "react";

export default function Card(props) {
  return (
    <div className="card">
      <div className="overlay">
        <div className="heading">{props.title}</div>
      </div>
    </div>
  );
}
