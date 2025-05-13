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
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { login, resetState } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import logoSaveWell from "../Images/logoSaveWell.png"; // Correct import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, isLoading } = useSelector((state) => state.users);

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess || user?.email) {
      navigate("/home"); // ✅ lowercase 'home' in route (case-sensitive)
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
          <h2 className="text-center mb-4" style={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
            Login to SaveWell
          </h2>
          <div className="text-center mb-4">
            <img src={logoSaveWell} alt="SaveWell Logo" width="150" />
          </div>
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
              />
            </FormGroup>
            <FormGroup>
              <Label for="password" style={{ color: "#e91e63", fontWeight: "600" }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>

            {isError && (
              <p className="text-danger text-center">Login failed. Please check your credentials.</p>
            )}

            <Button
              type="submit"
              color="success"
              style={{ backgroundColor: "#4CAF50", border: "none" }}
              block
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <p className="mt-3 text-center">
            No Account? <Link to="/register">Sign Up Now..</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
