import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import CreatePost from "./AddPost";
import PostCard from "./post-card";
import Cardlist from "./Cardlist";

const Profile = () => {
  const [UserProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, logout, token, user } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); 
 
  useEffect(() => {
    console.log("username", user)
    console.log("token",token)
    if (username && user) {
      setIsOwnProfile(username === user?.username);
    } else {
      setIsOwnProfile(false);
    }
  }, [username, user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("trying to fetch")
      try {
        const endpoint = isOwnProfile
          ? `${process.env.REACT_APP_API_URL}/profile/${username}`
          : `${process.env.REACT_APP_API_URL}/profile/public/${username}`;
          console.log("endpoint",endpoint)
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("response",response.data)
        setUserProfile(response.data);
        setSuccess(true);
      } catch (error) {
        console.log("error",error)
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
  }, [username, isLoggedIn, logout, token, isOwnProfile,success]);

  // Fetch posts with pagination
  const fetchPosts = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/profile/${username}/posts`,
        {
          params: { page },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newPosts=response.data.posts
      console.log("new posts",newPosts)
      setPosts((prevPosts) => {
        // Filter out duplicate posts
        const uniquePosts = newPosts.filter(post => !prevPosts.some(p => p.id === post.id));
        return [...prevPosts, ...uniquePosts]; // Append new unique posts
      });
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderPosts = () => {
    console.log("trying to render")
    return (
      <div className="container">
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 mb-3" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    console.log("page " ,page)
    if (!user || !user.userId) return;

    const fetchPostsOnce = async () => {
      if (!loading && hasMore) {
        await fetchPosts();
      }
    };
    fetchPostsOnce();
  }, [page, user]);

  // Infinite scroll handler
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100) {
      return; // Avoid fetching more posts
    }
    setPage((prevPage) => prevPage + 1); // Increment page number
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const checkConnection = () => {
      if (
        UserProfile &&
        user &&
        UserProfile.connections.includes(user.username)
      ) {
        setIsConnected(true);
      }
    };

    if (!isOwnProfile && UserProfile) {
      checkConnection();
    }
  }, [user, UserProfile, isOwnProfile]);

  const handleConnect = async () => {
    try {
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
    navigate("/accounts/edit");
  };

  const handleMessage = () => {
    navigate(`/accounts/${user.username}/messages`, {
      state: { selectedUser: UserProfile },
    });
  };

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
                          <p>{UserProfile.about || "No information available."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  {isOwnProfile && <CreatePost />}
                  <h5 className="text-center mb-4 mt-2">Posts</h5>
                  { (isConnected || isOwnProfile) && renderPosts() }
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
