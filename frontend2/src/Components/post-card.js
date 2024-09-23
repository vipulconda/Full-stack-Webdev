import React, { useState ,useEffect} from "react";
import axios from 'axios'
import { useAuth } from "../AuthContext";
const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {user,token}=useAuth();
  // Fetch like status from the server on component mount
  useEffect(() => {
    console.log("token",token)
    const fetchLikeStatus = async () => {
      if(!token || !post)return;
      const url= `${process.env.REACT_APP_API_URL}/posts/${user.userId}/${post._id}/isLiked`
      console.log("url",url);
      try {
       const response= await axios.get(
          `${process.env.REACT_APP_API_URL}/posts/${user.userId}/${post._id}/isLiked`,
          {
            headers: { Authorization: `Bearer ${token}`, },
          }
        );
        setIsLiked(response.data.isLiked); // Set initial like status from server
      } catch (error) {
        console.error("Error fetching like status", error);
      }
    };

    fetchLikeStatus();
  }, [post._id, ,showModal,user.userId, token]);

  // Handle Like and Unlike
  const handleLike = async () => {
    try {
      console.log("token",token)
       console.log("is liked", isLiked)
      if (isLiked) {
        // If already liked, unlike the post
        await axios.post(
          `${process.env.REACT_APP_API_URL}/posts/${user.userId}/${post._id}/unlike`,{},
          {
            headers: { Authorization: `Bearer ${token}`, },
          }
        );
        setLikes(likes - 1); // Decrease like count
        setIsLiked(false); // Set like status to false
      } else {
        // If not liked yet, like the post
        await axios.post(
          `${process.env.REACT_APP_API_URL}/posts/${user.userId}/${post._id}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikes(likes + 1); // Increase like count
        setIsLiked(true); // Set like status to true
      }
    } catch (error) {
      console.error("Error occurred during liking/unliking the post", error);
    }
  };
  const handleComment=()=>{
    setComments(comments+1)
  }
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div
        className="card mb-4"
        style={{ width: "100%", cursor: "pointer" }}
        onClick={handleOpenModal}
      >
        <div className="card">
          <img
            src={post.image}
            className="card-img-top"
            alt="post"
            style={{ cursor: "pointer", height: "200px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
            <i className="bi bi-arrow-left-circle-fill h2" onClick={handleCloseModal}></i>
            <h5 className="modal-title">Post Details</h5>
            </div>
            <div className="modal-body text-center">
              <img
                src={post.image}
                className="img-fluid"
                alt="post"
                style={{ objectFit: "cover", height: "300px" }}
              />

              <p className="mt-3">{post.content}</p>

              <div className="d-flex align-items-center mt-3">
                <div className="d-flex align-items-center mx-2">
                  <button className="btn btn-link p-0" onClick={handleLike}>
                    <i className={`bi bi-lg text-primary fs-5 ${isLiked ? "bi-heart-fill" : "bi-heart"}`}></i>
                  </button>
                  <span className="ms-2">{likes}</span>
                </div>

                <div className="d-flex align-items-center mx-2">
                  <button className="btn btn-link p-0" onClick={handleComment}>
                    <i className="bi bi-chat-left-text-fill text-primary fs-5 "></i>
                  </button>
                  <span className="ms-2">{comments}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </div>
  );
};

export default PostCard;
