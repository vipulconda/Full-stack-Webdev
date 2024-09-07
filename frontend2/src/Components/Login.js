import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import PageNotFound from "./pagenotfound";
import {useAuth} from '../AuthContext'
const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
   const {isLoggedIn,login ,logout}=useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
      
      const fullUrl = `${process.env.REACT_APP_API_URL}/login`;
      console.log(fullUrl)
      const response = await axios.post(fullUrl, { username, password });

      if (response && response.data) {
        // Store user information in local storage
        const userData = {
          username: response.data.username, 
          email: response.data.email,      
        };
        const authToken=response.data.token;
        login(userData,authToken);

        // Optionally, show success message using toastr
        toastr.success("Login Successful");

        // Redirect to Home page
        navigate("/Home");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during login");
      }
      console.error("Error logging in", error);
    }
  };

  return isLoggedIn ? (
    <PageNotFound />
  ) : (
    <>
      {/* Login 13 - Bootstrap Brain Component */}
      <section className="bg-gradient-primary py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              <div className="card border border-light-subtle rounded-3 shadow">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                    Sign in to your account
                  </h2>
                  {error && <p className="error-text text-danger">{error}</p>}
                  <form className="login-form" onSubmit={handleSubmit}>
                    <div className="row gy-2 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            autoComplete="current-username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                          />
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-flex gap-2 justify-content-between">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                            />
                            <label
                              className="form-check-label text-secondary"
                              htmlFor="rememberMe"
                            >
                              Keep me logged in
                            </label>
                          </div>
                          <a
                            href="/ResetPassword"
                            className="link-primary text-decoration-none"
                          >
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid my-3">
                          <button
                            type="submit"
                            className="btn btn-success btn-lg"
                          >
                            Log in
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <p className="m-0 text-secondary text-center">
                          Don't have an account?{" "}
                          <a
                            href="/Register"
                            className="link-primary text-decoration-none"
                          >
                            Sign up
                          </a>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
