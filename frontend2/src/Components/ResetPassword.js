import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ResetPassword = ({ BackendServer }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fullUrl = `${BackendServer}${"/resetpassword"}`;
      const response = await axios.post(
        fullUrl,
        { email },
        {
          headers: {
            "frontend-origin": window.location.origin,
          },
        }
      );
      if (response && response.data && response.status === 200) {
        console.log("Password reset message sent to your mail");
        setMsg("Password reset message sent to your mail");
        setError("");
        setSuccess(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.status === 404) {
          setError("The requested resource was not found.");
        } else {
          setError("An error occurred: " + error.response.data.message);
        }
      } else {
        setError("Message could'nt be send due to network reasons ");
      }
      setMsg("");
      setSuccess(false);
      console.error(error);
    }
  };
  return success ? (
    <div className="row justify-content-center">
      <div className="card col-6 text-danger" style={{ marginTop: 70 }}>
        <h3> Reset password link has been sent to your email </h3>
      </div>
    </div>
  ) : (
    <>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
      ></link>
      <div className="form-gap" style={{ paddingTop: 70 }} />
      <div className="container">
        <div className="row shadow-lg-2 justify-content-center ">
          <div className="card rounded-3 col-md-4 col-md-offset-4 bg-light">
            <div className="panel panel-default">
              <div className="panel-body p-3">
                <div className="text-center">
                  <h3>
                    <i className="fa fa-lock fa-3x" />
                  </h3>
                  <h2 className="text-center">Forgot Password?</h2>
                  <p>You can reset your password here.</p>
                  <div className="panel-body mt-6">
                    {message && <p className="text-success">{message}</p>}
                    {error && <p className="text-danger">{error}</p>}
                    <form
                      id="register-form"
                      role="form"
                      autoComplete="off"
                      className="form"
                      method="post"
                      onSubmit={handleSubmit}
                    >
                      <div className="form-group">
                        <div className="input-group mb-3">
                          <span className="input-group-text bg-dark">
                            <i className="bi bi-envelope text-light"></i>
                          </span>
                          <input
                            id="email"
                            name="email"
                            placeholder="email address"
                            className="form-control"
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 mb-3">
                        <div className="form-group">
                          <button
                            type="submit"
                            name="submit"
                            className="btn btn-dark"
                          >
                            Reset Password
                          </button>
                        </div>
                      </div>
                      <input
                        type="hidden"
                        className="hide"
                        name="token"
                        id="token"
                        defaultValue=""
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
