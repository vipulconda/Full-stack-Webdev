import React from "react";
import "./Contact.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Contact = ({BackendServer}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullUrl = `${BackendServer}${'/contact'}`
      const response = await axios.post(
       fullUrl,
        { firstname, lastname, email, mobilenumber, message }
      );
      if (response && response.data) {
        console.log("message sent successfully");
        navigate("/Home");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
        setSuccess("");
      } else {
        setError("An error occurred during sending message");
        setSuccess("");
      }
      console.log("error occured while sending message "+ error)
    }
  };

  return (
    <div className="container">
      <div className=" row shadow-lg-2 justify-content-center">
        <div className="no-gutters   py-md-3 col-14 col-sm-13 col-md-11 col-lg-9 col-xl-7 col-xxl-5 ">
          <div className="col-lg contact-info__wrapper bg-dark p-3 text-light ">
            <form
              className="contact-form form-validate"
              noValidate="novalidate"
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <div className="form-group ">
                    <label className="form-label" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={firstname}
                      onChange={(e)=>{
                        setFirstName(e.target.value)
                      }}
                      placeholder="Wendy"
                    />
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Appleseed"
                      value={lastname}
                      onChange={(e)=>{
                        setLastName(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e)=>{
                        setEmail(e.target.value)
                      }}
                      placeholder="wendy.apple@seed.com"
                    />
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="form-group">
                    <label htmlFor="tel" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={mobilenumber}
                      onChange={(e)=>{
                        setMobileNumber(e.target.value)
                      }}
                      placeholder="(021)-454-545"
                    />
                  </div>
                </div>
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      How can we help?
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows={4}
                      value={message}
                      onChange={(e)=>{
                        setMessage(e.target.value)
                      }}
                      placeholder="Hi there, I would like to....."
                      defaultValue={""}

                    />
                  </div>
                </div>
                <div className="col-sm-12 mb-3">
                  <button
                    type="submit"
                    name="submit"
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* End Contact Form Wrapper */}
        </div>
      </div>
    </div>
  );
};
export default Contact;
