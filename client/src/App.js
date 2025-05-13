// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import SavingsForm from "./Components/SavingsForm";
import Feedback from "./Components/Feedback";
import SavingsSummary from "./Components/SavingsSummary"; // 🆕 Add this import!
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./Features/UserSlice";
import './App.css';

// ✅ Separate LogoutLink component
const LogoutLink = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Link
      to="#"
      style={{ color: "white", textDecoration: "underline", cursor: "pointer" }}
      onClick={handleLogout}
    >
      Logout
    </Link>
  );
};

const App = () => {
  const email = useSelector((state) => state.users.user.email);

  // 🔒 Private Route
  const PrivateRoute = ({ children }) => {
    return email ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="page">
        {/* 🔝 Top Header */}
        <Row className="header align-items-center">
          <Col>
            {email && (
              <div>Welcome, {email}</div>
            )}
          </Col>
          <Col className="text-end">
            {email && (
              <div>
                <Link to="/home" style={{ color: "white", marginRight: "15px" }}>Home</Link>
                <Link to="/profile" style={{ color: "white", marginRight: "15px" }}>Profile</Link>
                <Link to="/savings" style={{ color: "white", marginRight: "15px" }}>Savings</Link>
                <Link to="/summary" style={{ color: "white", marginRight: "15px" }}>Summary</Link> {/* 🆕 Add link to SavingsSummary */}
                <Link to="/feedback" style={{ color: "white", marginRight: "15px" }}>Feedback</Link>
                <LogoutLink />
              </div>
            )}
          </Col>
        </Row>

        {/* 🔄 Main Routes */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/savings" element={<PrivateRoute><SavingsForm /></PrivateRoute>} />
            <Route path="/feedback" element={<PrivateRoute><Feedback /></PrivateRoute>} />
            <Route path="/summary" element={<PrivateRoute><SavingsSummary /></PrivateRoute>} /> {/* 🆕 Route to view savings summary */}
          </Routes>
        </main>

        {/* 🔻 Footer */}
        <Row>
          <footer className="footer">
            SaveWell App &copy; {new Date().getFullYear()}
          </footer>
        </Row>
      </div>
    </Router>
  );
};

export default App;
