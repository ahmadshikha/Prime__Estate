// import { useContext, useState } from "react";
// import "./navbar.scss";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// // import { useNotificationStore } from "../../lib/notificationStore";

// function Navbar() {
//   const [open, setOpen] = useState(false);

//   const { currentUser } = useContext(AuthContext);


//   return (
//     <nav>
//       <div className="left">
//         <a href="/" className="logo">
//           <img src="/logo.png" alt="" />
//           <span>Real STate</span>
//         </a>
//         <a href="/">Home</a>
//         <a href="/">About</a>
//         <a href="/">Contact</a>
//         <a href="/">Agents</a>
       
//       </div>
//       <div className="right">
//         {currentUser ? 
//          (
//           <div className="user">
//             <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
//             <span>{currentUser.username}</span>
//             <Link to="/profile" className="profile">
//               {/* {number > 0 && <div className="notification">{number}</div>} */}
//               <span>Profile</span>
//             </Link>
//           </div>
//         ) : (
//           <>
//             <a href="/login">Sign in</a>
//             <a href="/register" className="register">
//               Sign up
//             </a>
//           </>
//         )}
//         <div className="menuIcon">
//           <img
//             src="/menu.png"
//             alt=""
//             onClick={() => setOpen((prev) => !prev)}
//           />
//         </div>
//         <div className={open ? "menu active" : "menu"}>
//           <a href="/">Home</a>
//           <a href="/">About</a>
//           <a href="/">Contact</a>
//           <a href="/">Agents</a>
//           <a href="/">Sign in</a>
//           <a href="/">Sign up</a>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;












import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaSearch, FaBell, FaUserCircle, FaHome, FaInfoCircle, FaEnvelope, FaUsers } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "./navbar.scss";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);
  // number>0 &&
  if(currentUser) fetch();
 

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="container">
          <div className="left">
            <Link to="/" className="logo">
              <img src="/logo2.png" alt="Real Estate Logo" />
              <span>Prime Estate</span>
            </Link>
            
            <div className="search-bar">
              {/* <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit"><FaSearch /></button>
              </form> */}
            </div>
          </div>

          <div className="right">
            <div className="nav-links">
              <Link to="/"><FaHome /> Home</Link>
              <Link to="/"><FaInfoCircle /> About</Link>
              <Link to="/"><FaUsers /> Agents</Link>
              <Link to="/"><FaEnvelope /> Contact</Link>
            </div>

            {currentUser ? (
              <div className="user-actions">
                <Link to="/profile" className="notification-btn">
                  <FaBell />
                 { <span className="badge">{number}</span>}
                </Link>
                
                <Link to="/profile" className="user-profile">
                  <img 
                    src={currentUser.avatar || "/noavatar.jpg"} 
                    alt={currentUser.username} 
                    className="user-avatar"
                  />
                  <span className="username">{currentUser.username}</span>
                </Link>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn">Sign In</Link>
                <Link to="/register" className="register-btn">Sign Up</Link>
              </div>
            )}
{/* 33.51413437909089, 36.29153152579641 */}
{/* 34.026411, 36.723624 */}


            <button 
              className="menu-toggle" 
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <IoClose /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <div className="mobile-search">
         
        </div>

        <div className="mobile-links">
          <Link to="/" onClick={() => setOpen(false)}><FaHome /> Home</Link>
          <Link to="/" onClick={() => setOpen(false)}><FaInfoCircle /> About</Link>
          <Link to="/" onClick={() => setOpen(false)}><FaUsers /> Agents</Link>
          <Link to="/" onClick={() => setOpen(false)}><FaEnvelope /> Contact</Link>
          
          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}><FaUserCircle /> Profile</Link>
              <Link to="/profile" onClick={() => setOpen(false)}><FaBell /> Notifications</Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;