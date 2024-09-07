import React from "react";
import { useState ,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [contact, setContactNumber] = useState("");
  const otpGenerated = null;
  const Navigate = useNavigate();
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false); //
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleverificaton = async (e) => {
    e.preventDefault();
    try {
      const fullUrl = `${process.env.REACT_APP_API_URL}/${"/send-otp"}`;
      const response = await axios.post(fullUrl, {
        firstname,
        lastname,
        contact,
        email,
        username,
        password,
      });
      if (response && response.status === 200) {
        console.log("otp send to registered email");
        setIsOtpSent(true);
        setTimer(300); // Reset timer
        setError("");
        setSuccess('"otp send to your  email"');
        setSuccessVisible(true);
        setTimeout(() => {
          setErrorVisible(false);
        }, 5000);
        return;
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
        console.error(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
        setSuccess("");
        console.error("Signup error:", error.message);
      }
      setErrorVisible(true);
      // Remove the error message after 5 seconds
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}${"/register"}`, {
        firstname,
        lastname,
        contact,
        email,
        username,
        password,
        otp,
      });
      console.log("registration done successfully");
      localStorage.clear();
      Navigate("/login");
    } catch (error) {
      console.error();
      setError("Could'nt able to register");
      setErrorVisible(true);
      // Remove the error message after 5 seconds
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  };
  return (
    <>
      {/* Login 13 - Bootstrap Brain Component */}
      <section className="bg-light py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
              <div className="card border border-light-subtle rounded-3 shadow-sm">
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <h2 className="fs-6 fw-semibold text-center text-secondary mb-4">
                    Register your account
                  </h2>
                  {errorVisible && (
                    <p className="error-text text-danger">{error}</p>
                  )}
                  {successVisible && (
                    <p className="error-text text-danger">{success}</p>
                  )}

                  <form className="register-form" onSubmit={handleSubmit}>
                    <div className="row gy-2 overflow-hidden ">
                      <div className="col-12">
                        <div className="input-group form-floating ">
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="text"
                              id="usr"
                              placeholder="First Name"
                              value={firstname}
                              onChange={(e) => setFirstName(e.target.value)}
                              required=""
                            />
                            <label htmlFor="text" className="form-label">
                              First Name
                            </label>
                          </div>
                          <div className="form-floating mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="text"
                              id="usr1"
                              value={lastname}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="Last Name"
                              required=""
                            />
                            <label htmlFor="text" className="form-label">
                              Last Name
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="tel"
                            className="form-control"
                            name="contactNumber"
                            id="contactNumber"
                            value={contact}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="12346789"
                            required=""
                          />
                          <label htmlFor="" className="form-label">
                            Contact number
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control "
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required=""
                          />
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="vipul02vns"
                            required=""
                          />
                          <label htmlFor="" className="form-label">
                            Username
                          </label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-2">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required=""
                          />
                          <label htmlFor="password" className="form-lab ">
                            Password
                          </label>
                        </div>
                      </div>
                      <div className="col-12 input-group">
                        <div className="form-floating mb-3">
                          <input
                            type="string"
                            className="form-control mb-3"
                            name="otp"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            required=""
                          />
                          <label htmlFor="otp" className="form-label">
                            6-digit OTP
                          </label>
                        </div>
                        <div className="form-floating p-1 ">
                          <button
                            className="btn btn-dark btn-lg text-light py-2"
                            type="Send OTP"
                            onClick={handleverificaton}
                          >
                            Send OTP
                          </button>
                          <div>
                            Time left: {Math.floor(timer / 60)}:
                            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid my-3">
                          <button
                            className="btn btn-success btn-lg"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <p className="m-0 text-secondary text-center">
                          Alreay have an account?{" "}
                          <a
                            href="/Login"
                            className="link-primary text-decoration-none"
                          >
                            Log in
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
export default Register;
