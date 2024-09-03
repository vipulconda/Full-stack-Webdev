import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const UpdatePassword = ({ BackendServer }) => {
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const [isValidtoken, setIsvalidtoken] = useState(false);
  const [error, setError] = useState("");
  const fullUrl = `${BackendServer}${"/newpassword"}`;
  const validateToken = async() => {
    try {
      const response = await axios.post(`${BackendServer}${"/verifytoken"}`, {
        token,
      });
      if (response && response.status === 200) {
        console.log("valid token");
        setIsvalidtoken(true);
      }
    } catch (error) {
      setIsvalidtoken(false)
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    validateToken(token);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmpassword) {
        setMessage("Passwords do not match");
        return;
      }
      const response = await axios.post(fullUrl, { token, password });
      if (response && response.data && response.status === 200) {
        setMessage("Password Changed Successfully");
        console.log("Password Changed Successfully");
        navigate("/Login");
      }
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };
  return (
    isValidtoken && token ?
   ( <div className="container">
      <div className="form-gap" style={{ paddingTop: 70 }}>
        <div className="row  shadow-lg-2 justify-content-center ">
          <div className="card rounded-3 col-md-4 col-md-offset-4 bg-light p-3 ">
            <h2>Reset Password</h2>
            {message && <p>{message}</p>}
            <form
              id="register-form"
              role="form"
              autoComplete="off"
              className="form"
              method="post"
              onSubmit={handleSubmit}
            >
              <input
                type="password"
                placeholder="New Password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-control mb-3"
                value={confirmpassword}
                onChange={(e) => setconfirmpassword(e.target.value)}
                required
              />
              <button className="btn btn-primary mb-2" type="submit">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>): <p>Password Reset link expired or invalid</p>
  );
};
export default UpdatePassword;
