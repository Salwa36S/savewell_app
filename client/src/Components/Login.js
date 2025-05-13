// src/Components/Login.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { login, resetState } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import logoSaveWell from "../Images/logoSaveWell.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle Password

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, isLoading } = useSelector((state) => state.users);

  const handleLogin = (e) => {
    e.preventDefault();

    // 🛡️ Trim and validate email before sending
    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    const userData = {
      email: cleanEmail,
      password,
    };
    dispatch(login(userData));
  };

  // 📧 Simple Email Validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (isSuccess || user?.email) {
      navigate("/home");
    }
  }, [isSuccess, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return (
    <Container className="login-page py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            <img src={logoSaveWell} alt="SaveWell Logo" width="150" />
          </div>

          <h2 className="text-center mb-4" style={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
            Login to SaveWell
          </h2>

          <Form onSubmit={handleLogin} autoComplete="off">
            <FormGroup>
              <Label for="email" style={{ color: "#e91e63", fontWeight: "600" }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </FormGroup>

            <FormGroup>
              <Label for="password" style={{ color: "#e91e63", fontWeight: "600" }}>
                Password
              </Label>
              <div style={{ position: "relative" }}>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  color="link"
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </FormGroup>

            {isError && (
              <p className="text-danger text-center">
                ❌ Login failed. Please check your credentials.
              </p>
            )}

            <Button
              type="submit"
              color="success"
              block
              disabled={isLoading || !email || !password}
              style={{ backgroundColor: "#4CAF50", border: "none" }}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form>

          <p className="mt-3 text-center">
            No Account?{" "}
            <Link to="/register" style={{ textDecoration: "underline", color: "#e91e63", fontWeight: "600" }}>
              Sign Up Now..
            </Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
