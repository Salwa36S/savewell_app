// client/src/Components/Register.js
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userValidationsSchema),
  });

  const handleSubmit = async (data) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      console.log("Validation passed:", data);

      // Dispatch registerUser
      await dispatch(registerUser(userData));

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  return (
    <div
      className="register-background"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }}
    >
      <Container className="register-page py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <h2 className="text-center register-title mb-4">Register for SaveWell</h2>
            <Form onSubmit={submitForm(handleSubmit)} autoComplete="off">
              <FormGroup>
                <Label for="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  onChange={(e) => {
                    setValue("name", e.target.value);
                    trigger("name");
                  }}
                  placeholder="Enter your name"
                />
                <p className="text-danger">{errors.name?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  onChange={(e) => {
                    setValue("email", e.target.value);
                    trigger("email");
                  }}
                  placeholder="Enter your email"
                />
                <p className="text-danger">{errors.email?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    trigger("password");
                  }}
                  placeholder="Enter your password"
                />
                <p className="text-danger">{errors.password?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label for="confirmpassword">Confirm Password</Label>
                <Input
                  id="confirmpassword"
                  type="password"
                  {...register("confirmpassword")}
                  onChange={(e) => {
                    setValue("confirmpassword", e.target.value);
                    trigger("confirmpassword");
                  }}
                  placeholder="Confirm your password"
                />
                <p className="text-danger">{errors.confirmpassword?.message}</p>
              </FormGroup>

              <Button type="submit" color="primary" className="w-100">
                Register
              </Button>

              <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Login Here</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
