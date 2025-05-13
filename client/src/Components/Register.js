// src/Components/Register.js

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
import { useDispatch } from "react-redux";
import { registerUser } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userValidationsSchema } from "../Validation/UserValidation";
import backgroundImage from "../Images/backgroud.jpg";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userValidationsSchema),
  });

  const handleSubmit = async (data) => {
    try {
      const userData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      console.log("Validation passed:", userData);

      await dispatch(registerUser(userData)).unwrap();

      alert("🎉 Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Registration failed. Try again.");
    }
  };

  return (
    <div
      className="register-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Container className="register-page py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h2 className="text-center mb-4" style={{ fontFamily: "Segoe UI", fontWeight: "bold" }}>
              Register for SaveWell
            </h2>

            <Form onSubmit={submitForm(handleSubmit)} autoComplete="off">
              {[
                { id: "name", type: "text", label: "Full Name", placeholder: "Enter your name" },
                { id: "email", type: "email", label: "Email", placeholder: "Enter your email" },
                { id: "password", type: "password", label: "Password", placeholder: "Enter your password" },
                { id: "confirmpassword", type: "password", label: "Confirm Password", placeholder: "Confirm your password" },
              ].map(({ id, type, label, placeholder }) => (
                <FormGroup key={id}>
                  <Label for={id} style={{ color: "#e91e63", fontWeight: "600" }}>
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type={type}
                    {...register(id)}
                    onChange={(e) => {
                      setValue(id, e.target.value);
                      trigger(id);
                    }}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                  />
                  <p className="text-danger" style={{ fontSize: "0.9rem" }}>{errors[id]?.message}</p>
                </FormGroup>
              ))}

              <Button
                type="submit"
                block
                disabled={isSubmitting}
                style={{
                  backgroundColor: "#4CAF50",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>

              <p className="mt-3 text-center" style={{ fontSize: "0.95rem" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "underline", color: "#e91e63", fontWeight: "600" }}>
                  Login Here
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
