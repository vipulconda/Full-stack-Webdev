import React from "react";

const Card = ({ title, data }) => {
  return (
    <div className="card shadow-sm border-light rounded-3" >
      <img
        src="https://picsum.photos/100/70"
        className="card-img-top"
        alt="..."
      />
      <div className="card-body bg-dark">
        <h5 className="card-title text-white">{title}</h5>
        <p className="card-text text-white">{data}</p>
        <a href="#" className="btn btn-danger mr-auto">
          <i className="fas fa-link" /> Read More
        </a>
      </div>
    </div>
  );
};
export default Card;
