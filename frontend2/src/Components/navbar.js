import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, user } = useAuth();

  const handleonClick = () => {
    navigate("/Login");
  };

  const handleProfile = () => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (user && user.username) {
      const username = user.username;
      console.log("Username from localStorage:", username);
      const url = `/profile/${username}`;
      navigate(url);
    } else {
      logout();
      console.error("No username found in local storage");
    }
  };

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark ">
      <div className="container-fluid">
        <a className="navbar-brand" href="/Home">
          Studypoint
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav  mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/Home">
                <i className="bi bi-house-door p-1 " />
                Home
              </a>
            </li>
            <li className="nav-item ">
              <a className="nav-link active" href="#">
                <i className="bi bi-journal-check p-1"></i>
                Resources
              </a>
            </li>
            <li className="nav-item dropdown ">
              <a
                className="nav-link dropdown-toggle active "
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Batches
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item " href="#">
                    Pre-Foundation
                  </a>
                </li>
                <li>
                  <a className="dropdown-item " href="#">
                    Foundation-11th
                  </a>
                </li>
                <li>
                  <a className="dropdown-item " href="#">
                    Foundation-12th
                  </a>
                </li>
                <li>
                  <a className="dropdown-item " href="#">
                    Target
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/contact">
                <i className="bi bi-envelope p-1"></i>
                Contact Us
              </a>
            </li>
          </ul>
          <div className="container col-5 me-auto">
            <form className="d-flex p-2 " role="search">
              <input
                className="form-control me-2 col-12 col-sm-10 col-md-8 col-lg-5"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
          {!isLoggedIn && (
            <button
              className="btn btn-success btn-sm me-2"
              type="button"
              onClick={() => {
                navigate("/Register");
              }}
            >
              Register
            </button>
          )}
          {isLoggedIn ? (
            <button
              className="btn btn-light btn-sm rounded-pill"
              type="button"
              onClick={handleProfile}
            >
              <i
                className="bi bi-person-circle text-primary"
                style={{ fontSize: "1.5rem" }}
              >
                {" "}
              </i>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={handleonClick}
            >
              <i className="bi bi-box-arrow-in-right px-1"></i>
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
