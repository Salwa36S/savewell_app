// Profile.jsx
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../Features/UserSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userValidationsSchema } from "../Validation/UserValidation";
import Location from "./Location";
import profilePlaceholder from "../Images/profile.png";
import loc from "../Images/loc.png";
import "../App.css"; // ✅ Styling for button/image if needed

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.users);

  const [name, setName] = useState(user.name || "");
  const [pwd, setPwd] = useState(user.password || "");
  const [profilePic, setProfilePic] = useState(user.profilePic || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userValidationsSchema),
  });

  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user.email, navigate]);

  const onSubmit = () => {
    const updatedUser = new FormData();
    updatedUser.append("email", user.email);
    updatedUser.append("name", name);
    updatedUser.append("password", pwd);
    if (profilePic && typeof profilePic !== "string") {
      updatedUser.append("profilePic", profilePic);
    }

    dispatch(updateUserProfile(updatedUser));
    alert("Profile Updated Successfully!");
    navigate("/login"); // Force re-login after updating
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const renderProfileImage = () => {
    if (profilePic && typeof profilePic === "string") {
      return `http://localhost:3001/uploads/${profilePic}`; // Adjust URL if your server address is different
    } else if (profilePic && typeof profilePic === "object") {
      return URL.createObjectURL(profilePic);
    } else {
      return profilePlaceholder;
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-start">
        {/* Profile Information */}
        <Col md={7} className="text-center">
          <img
            src={renderProfileImage()}
            alt="User"
            className="profileImage mb-4"
            style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover" }}
          />

          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="text-start">
              <Label>Upload New Profile Photo</Label>
              <Input type="file" onChange={handleFileChange} />
            </FormGroup>

            <FormGroup className="text-start">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                {...register("name")}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </FormGroup>

            <FormGroup className="text-start">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={pwd}
                {...register("password")}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </FormGroup>

            <Button color="primary" type="submit" disabled={isLoading} block>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </Form>
        </Col>

        {/* Location Section */}
        <Col md={5} className="text-center">
          <img
            src={loc}
            alt="Location Icon"
            className="profileImage mb-4"
            style={{ width: "150px", height: "150px" }}
          />
          <h3>Your Location</h3>
          <Location />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
