import React from "react";
import Cards from './Cardlist.js'

const Home = ({Cardlist}) => {
  
  return (
    <div>
    <div className="">
      <div
        id="carouselExampleIndicators"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={3}
            aria-label="Slide 4"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={4}
            aria-label="Slide 5"
          />
        </div>
        {/* Image Sliders */}
        <div className="carousel-inner">
          {/* Image one*/}
          <div className="carousel-item active">
            <img
              src="https://user-images.githubusercontent.com/78242022/273443252-b034e050-3d70-48ef-9f0f-2d77ef9b2604.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          {/* image two */}
          <div className="carousel-item">
            <img
              src="https://user-images.githubusercontent.com/78242022/282697437-bb8d7140-128f-44e9-a11f-d0d5c8d29f87.png"
              className="d-block w-100"
              alt="..."
            />
          </div>
          {/* Image Three */}
          <div className="carousel-item">
            <img
              src="https://user-images.githubusercontent.com/78242022/273443248-130249b5-87b7-423d-9281-48d810bcd30d.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          {/* Image Four */}
          <div className="carousel-item">
            <img
              src="https://user-images.githubusercontent.com/78242022/273443251-9c210d6f-35ba-4861-885e-9b2e684ab339.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          {/* Image Five */}
          <div className="carousel-item">
            <img
              src="https://user-images.githubusercontent.com/78242022/282697428-7690f46f-5446-475a-be69-dbf5d8ccfacd.png"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        {/* Carousel Controls */}
        <section>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </section>
      </div>
      </div>

     <div className="card container">
     <Cards Cardlist={Cardlist}/>
     </div>
    </div>
  );
};
export default Home;
