import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/login"); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
