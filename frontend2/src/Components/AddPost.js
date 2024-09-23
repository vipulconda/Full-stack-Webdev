import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const CreatePost = () => {
  const { username, token, user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  const maxFileSize = 4 * 1024 * 1024; // 4 MB
  const [previewPic, setPreviewPic] = useState('');
  const handleContentChange = (e) => setContent(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Invalid file type. Only .jpg, .jpeg, .png, .gif, and .bmp are allowed.');
        setImage(null);
        setPreviewPic('');
      } else if (file.size > maxFileSize) {
        setError('File size exceeds 4MB limit.');
        setImage(null);
        setPreviewPic('');
      } else {
        setError('');
        const image_url = URL.createObjectURL(file);
        setImage(file);
        setPreviewPic(image_url);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !image) {
      setError('Both content and image are required.');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('content', content);
    formData.append('image', image);

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/${user.userId}/create-post`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Handle successful post creation
      setContent(''); // Clear form after submission
      setImage(null);
      setPreviewPic('');
      setIsModalOpen(false); // Close the modal after successful post
    } catch (error) {
      console.error(error);
      setError('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      // Reset the form when the modal is closed
      setContent('');
      setImage(null);
      setPreviewPic('');
      setError('');
    }
  };

  const selectImage = () => {
    document.getElementById('post-image').click();
  };

  return (
    <>
       <div className='row text-start'>
       <button
        type="button"
        className="btn w-auto"
        data-toggle="modal"
        data-target="#createPostModal"
        onClick={toggleModal}
      >
       <i className="bi bi-plus-circle-fill h2 text-primary"></i>
      </button>
       </div>

      {isModalOpen && (
        <div
          className="modal fade show d-block"
          id="createPostModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="createPostLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createPostLabel">
                  Create New Post
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={toggleModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  {/* Image Upload Section */}
                  <div
                    className="card shadow-lg border-light"
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <div className="card-body text-center position-relative">
                      <div className="position-relative d-inline-block">
                        <img
                          src={
                            previewPic
                              ? previewPic
                              : 'https://res.cloudinary.com/dgnldu9be/image/upload/v1726063126/3135715_pvfqw5.png'
                          }
                          alt="Post Preview"
                          className="mb-3"
                          style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '2px solid',
                          }}
                          onClick={selectImage}
                        />
                        <input
                          type="file"
                          className="form-control-file d-none"
                          id="post-image"
                          onChange={handleImageChange}
                        />
                      </div>

                      <div className="form-group mt-3">
                        <label htmlFor="post-content">Post Content:</label>
                        <textarea
                          className="form-control"
                          id="post-content"
                          rows="2"
                          placeholder="Write your post content here..."
                          value={content}
                          onChange={handleContentChange}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger mt-3"
                      role="alert"
                      aria-live="assertive"
                    >
                      {error}
                    </div>
                  )}
                </form>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
