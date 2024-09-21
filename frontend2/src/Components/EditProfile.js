import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "India",
  "Australia",
  "Germany",
  "France",
  "China",
  "Japan",
  "Brazil",
];

const EditProfile = () => {
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    university: "",
    gender: "",
    nationality: "",
    address: "",
    contact: "",
    dob: "",
    profilepic: null,
    about: "",
  });
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, login, logout, user, token } = useAuth();
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const maxFileSize = 2 * 1024 * 1024; // 2 MB
  const [previewPic, setPreviewPic] = useState("");
  const username = user.username;
  useEffect(() => {
    // Check if user is authorized
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    // Load data from backend when component mounts
    axios
      .get(`${process.env.REACT_APP_API_URL}/profile/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setProfileData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          university: data.university || "",
          gender: data.gender || "",
          nationality: data.nationality || "",
          address: data.address || "",
          contact: data.contact || "",
          dob: data.dob ? formatDate(data.dob) : "", // Format date
          profilepic: data.profilepic ? data.profilepic : null,
          about: data.about || "",
        });
        setPreviewPic(data.profilepic);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setFormError("Failed to load profile data. Please try again.");
      });
  }, [isLoggedIn, username, navigate]);

  useEffect(() => {
    localStorage.setItem("ProfileData", JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    if (imageError || formError) {
      const timer = setTimeout(() => {
        setImageError("");
        setFormError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [imageError, formError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setImageError(
        "Invalid file type. Only .jpg, .jpeg, .png, .gif, and .bmp are allowed."
      );
      setProfileData((prevData) => ({
        ...prevData,
        profilepic: null,
      }));
      setPreviewPic("");
    } else if (file.size > maxFileSize) {
      setImageError("File size exceeds 2 MB limit.");
      setProfileData((prevData) => ({
        ...prevData,
        profilepic: null,
      }));
      setPreviewPic("");
    } else {
      setImageError("");
      const image_url = URL.createObjectURL(file);
      setProfileData((prevData) => ({
        ...prevData,
        profilepic: file, // Set the image URL for preview
      }));
      setPreviewPic(image_url);
    }
  };

  const triggerProfilePicInput = () => {
    document.getElementById("profilePicInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      formData.append(key, profileData[key]);
    });

    try {
      const fullUrl = `${process.env.REACT_APP_API_URL}/edit`;
      const response = await axios.post(fullUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          username: username,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("Profile updated successfully");
        setFormError("");
        navigate(`/profile/${username}`);
      } else {
        setFormError("Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setFormError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return isLoggedIn ? (
    <div className="container my-5">
      <div className="row">
        {/* Left Column: Profile Image and Logout */}
        <div className="col-md-4 mb-4">
          {/* Profile Image Card */}
          <div
            className="card shadow-lg border-light rounded-4 mb-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="card-body text-center position-relative">
              <div className="position-relative d-inline-block">
                <img
                  src={
                    previewPic ? previewPic : "https://via.placeholder.com/150"
                  }
                  alt="User Profile"
                  className="rounded-circle mb-3"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "4px solid #007bff",
                  }}
                  onClick={triggerProfilePicInput}
                />
                <div
                  className="position-absolute bottom-0 end-0 translate-middle p-1 bg-white rounded-circle border border-light"
                  style={{ cursor: "pointer", zIndex: 2 }}
                  onClick={triggerProfilePicInput}
                >
                  <FaCamera size={20} color="#007bff" />
                </div>
              </div>
              <input
                type="file"
                id="profilePicInput"
                className="form-control d-none"
                name="profilepic"
                onChange={handleProfilePicChange}
              />
              <h4 className="mt-3 mb-1" style={{ fontWeight: "bold" }}>{`${
                profileData.firstname || "First Name"
              } ${profileData.lastname || "Last Name"}`}</h4>
              <p className="text-muted">{profileData.about || "About Me"}</p>
              {imageError && (
                <div className="alert alert-danger" role="alert">
                  {imageError}
                </div>
              )}
            </div>
          </div>

          {/* Contact and Logout Card */}
          <div
            className="card shadow-lg border-light rounded-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="card-body">
              <button
                className="btn btn-outline-primary w-75 mb-3"
                onClick={() => navigate("/contact")}
                style={{
                  borderRadius: "25px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                Contact
              </button>
              <button
                className="btn btn-outline-danger w-75"
                onClick={handleLogout}
                style={{
                  borderRadius: "25px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="col-md-8">
          <div
            className="card shadow-lg border-light rounded-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div
              className="card-header bg-primary text-white text-center"
              style={{
                borderTopLeftRadius: "0.375rem",
                borderTopRightRadius: "0.375rem",
              }}
            >
              <h3>Edit Profile</h3>
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="firstname"
                      value={profileData.firstname}
                      onChange={handleChange}
                      placeholder="First Name"
                      style={{ borderRadius: "25px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control shadow-sm"
                      name="lastname"
                      value={profileData.lastname}
                      onChange={handleChange}
                      placeholder="Last Name"
                      style={{ borderRadius: "25px" }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">University</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    name="university"
                    value={profileData.university}
                    onChange={handleChange}
                    placeholder="University/College"
                    style={{ borderRadius: "25px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select shadow-sm"
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    style={{ borderRadius: "25px" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nationality</label>
                  <select
                    className="form-select shadow-sm"
                    name="nationality"
                    value={profileData.nationality}
                    onChange={handleChange}
                    style={{ borderRadius: "25px" }}
                  >
                    <option value="">Select Nationality</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    style={{ borderRadius: "25px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    name="contact"
                    value={profileData.contact}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    style={{ borderRadius: "25px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control shadow-sm"
                    name="dob"
                    value={profileData.dob}
                    onChange={handleChange}
                    style={{ borderRadius: "25px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">About</label>
                  <textarea
                    className="form-control shadow-sm"
                    name="about"
                    value={profileData.about}
                    onChange={handleChange}
                    placeholder="About"
                    rows="3"
                    style={{ borderRadius: "25px" }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ borderRadius: "25px" }}
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      Unauthorized Access. Please <a href="/login">log in</a>.
    </div>
  );
};

export default EditProfile;
