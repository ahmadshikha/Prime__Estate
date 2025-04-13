import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./profileUpdatePage.scss";

axios.defaults.withCredentials = true;

function ProfileUpdatePage() {
  const { token, updateUser, currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatar, setAvatar] = useState(currentUser?.avatar ? [currentUser.avatar] : []);
  const navigate = useNavigate();
  const API_URL = "http://localhost:8800/api";

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value || undefined,
      avatar: avatar[0] || currentUser?.avatar || undefined
    };
  
    try {
      const res = await axios.put(
        `${API_URL}/users/${currentUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      // تأكيد أن البيانات تحتوي على رابط الصورة الجديد
      const newAvatarUrl = avatar[0] || res.data.user?.avatar;
      
      const updatedData = {
        user: {
          ...currentUser,
          username: res.data.user?.username || currentUser.username,
          email: res.data.user?.email || currentUser.email,
          avatar: newAvatarUrl 
        },
        token: res.data.token || token
      };
  
      updateUser(updatedData);
      setSuccess("update profile succesfuly");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "error while updating");
    }
  };

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          
          <div className="formGroup">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          <button type="submit" className="submitBtn">
            Update Profile
          </button>
          
          {error && <div className="errorMessage">{error}</div>}
          {success && <div className="successMessage">{success}</div>}
        </form>
      </div>
      
      <div className="avatarContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt="Profile"
          className="avatarImage"
          onError={(e) => {
            e.target.src = "/noavatar.jpg";
          }}
        />
        
        <UploadWidget
          uwConfig={{
            cloudName: "dvllquouf",
            uploadPreset: "estate_ahmad",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar} 
        />
        
        <p className="uploadHint">Max file size: 2MB (JPEG, PNG)</p>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;