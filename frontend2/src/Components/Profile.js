import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";

const Profile = () => {
  const [UserProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const [isEdited, setIsEdited] = useState(false);
  const { isLoggedIn, login, logout, token, user } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(username === user?.username);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // State for all messages
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (username && user) {
      setIsOwnProfile(username === user?.username);
    }
  }, [username, user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const endpoint = isOwnProfile
          ? `${process.env.REACT_APP_API_URL}/profile/${username}`
          : `${process.env.REACT_APP_API_URL}/profile/public/${username}`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(response.data);
        setSuccess(true);
        //console.log(response.data)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in.");
          logout();
          navigate("/login");
        } else {
          setError("User not found");
          logout();
          navigate("/login");
        }
        setSuccess(false);
      }
    };

    fetchUserProfile();
  }, [
    username,
    isLoggedIn,
    isEdited,
    navigate,
    logout,
    token,
    isOwnProfile,
  ]);

  useEffect(() => {
    const checkConnection = () => {
      if (UserProfile.connections.includes(user.username)) {
        setIsConnected(true);
      }
    };
    if (!isOwnProfile && UserProfile) {
      checkConnection();
    }
  }, [user, UserProfile, setIsConnected, isOwnProfile]);
  const handleConnect = async () => {
    try {
      console.log("connection status ", isConnected);

      if (isConnected) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/disconnect/${username}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsConnected(false);
      } else {
        console.log("token ", token);
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/connect/${username}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error updating Connect status:", error);
    }
  };
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };
  const goToInbox = () => {
    navigate(`/accounts/${user.username}/messages`);
  };

  const editProfile = () => {
    setIsEdited(!isEdited);
    navigate("/accounts/edit");
  };
  const handleMessage=()=>{
    navigate(`/accounts/${user.username}/messages`, { state: { selectedUser: UserProfile } });
  }

  return success ? (
    <>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center">
            <div className="col col-lg-9 col-xl-8">
              <div className="card">
                <div
                  className="rounded-top text-white d-flex p-2 justify-content-center"
                  style={{ backgroundColor: "#000" }}
                >
                  <div className="d-flex flex-column align-items-center">
                    <img
                      src={UserProfile.profilepic}
                      alt="Profile"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                    {isOwnProfile && (
                      <div className="d-flex mt-3">
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={editProfile}
                        >
                          <i className="fa fa-cog p-1"></i> Edit Profile
                        </button>
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={goToInbox}
                        >
                          <i className="fa fa-envelope"></i> Inbox
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={handleLogout}
                        >
                          <i className="fa fa-sign-out"></i> Logout
                        </button>
                      </div>
                    )}
                    {!isOwnProfile && (
                      <div className="m-2 p-1">
                        <button
                          onClick={handleConnect}
                          className={`btn ${
                            isConnected
                              ? "btn-outline-secondary"
                              : "btn-primary"
                          } btn-sm`}
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </button>
                        <button
                           onClick={handleMessage}
                          className="btn btn-sm btn-secondary text-light mx-2"
                        >
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-body text-black">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card">
                        <div className="card-header bg-primary text-white">
                          Personal Information
                        </div>
                        <div className="card-body">
                          <p>
                            <strong>Name:</strong> {UserProfile.firstname}{" "}
                            {UserProfile.lastname}
                          </p>

                          <p>
                            <strong>Username:</strong> {UserProfile.username}
                          </p>
                          <p>
                            <strong>Email:</strong> {UserProfile.email}
                          </p>
                          <p>
                            <strong>University:</strong>{" "}
                            {UserProfile.university}
                          </p>

                          {isOwnProfile && (
                            <>
                              <p>
                                <strong>Contact:</strong> {UserProfile.contact}
                              </p>
                              <p>
                                <strong>Address:</strong> {UserProfile.address}
                              </p>
                              <p>
                                <strong>Date of Birth:</strong>{" "}
                                {new Date(UserProfile.dob).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Gender:</strong> {UserProfile.gender}
                              </p>
                              <p>
                                <strong>Nationality:</strong>{" "}
                                {UserProfile.nationality}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="card">
                        <div className="card-header bg-info text-white">
                          About
                        </div>
                        <div className="card-body">
                          <p className="font-italic">{UserProfile.about}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0">Recent Photos</p>
                    <p className="mb-0">
                      <a href="#!" className="text-muted">
                        Show all
                      </a>
                    </p>
                  </div>
                  <div className="row g-2">
                    <div className="col mb-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                        alt="image 1"
                        className="w-100 rounded-3"
                      />
                    </div>
                    <div className="col mb-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                        alt="image 1"
                        className="w-100 rounded-3"
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                        alt="image 1"
                        className="w-100 rounded-3"
                      />
                    </div>
                    <div className="col">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                        alt="image 1"
                        className="w-100 rounded-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    <div className="container text-center">
      {error && <h1 className="mt-5">Error: {error}</h1>}
    </div>
  );
};

export default Profile;
