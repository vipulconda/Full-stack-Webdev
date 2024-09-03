import React, { useState, useEffect } from "react";

const EmailVerify = () => {
  const [otp, setotp] = useState("");

  return (
    <>
      <div className="container">
        <div className="row" style={{paddingTop: 70}}>
          <div className="card rounded-3 col-md-4 col-md-offset-4 bg-light p-3">
                <h2>OTP has been send to your email</h2>
                <form 
                id="register-form"
                role="form"
                autoComplete="off"
                className="form"
                method="post"
                onSubmit={handleSubmit}
               >
                    <label>
                        Enter OTP
                    </label>
                    <input
                      type="password"
                      placeholder="Enter 6-digit OTP"
                      className="form-control mb-3"
                      value={otp}
                      onChange={(e) => setpassword(e.target.value)}
                      required
                    />
                    <button className="btn btn-primary">Verify</button>
                </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerify;
