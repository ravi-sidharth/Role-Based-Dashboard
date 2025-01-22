import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login/Login";
import Signup from "../Components/Signup/Signup";
import UserDashboard from "../Components/User-Dashboard/UserDashboard";
import AdminDashboard from "../Components/Admin-Dashboard/AdminDashboard";

function Router() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/user/dashboard" element={<UserDashboard/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      </Routes>
    </div>
  );
}

export default Router;
