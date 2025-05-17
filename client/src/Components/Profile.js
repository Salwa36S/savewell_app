import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../Features/UserSlice";
import {
  Container, Row, Col, Form, FormGroup, Label,
  Input, Button, Spinner, Card, CardBody
} from "reactstrap";
import Location from "./Location";
import defaultProfileImage from "../Images/profile.png";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.users);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target.profilePic.files[0];
    if (!file) return alert("Please choose an image");

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("name", user.name);
    formData.append("profilePic", file);

    dispatch(updateUserProfile(formData));
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted && user?.profilePic) {
      setPreview(`http://localhost:3001/uploads/${user.profilePic}`);
    }
  }, [submitted, user]);

  const imageToDisplay = preview || (user?.profilePic
    ? `http://localhost:3001/uploads/${user.profilePic}`
    : defaultProfileImage);

  return (
    <Container className="my-5">
      <Row>
        {/* LEFT: User Profile */}
        <Col md={6}>
          <Card className="p-4 userdisplay">
            <CardBody className="text-center">
              <h3 className="register-title">👤 Your Profile</h3>
              <img
                src={imageToDisplay}
                alt="Profile"
                className="profileImage"
              />
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>

              {/* 📸 Upload image */}
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <FormGroup>
                  <Label for="profilePic">Update Profile Picture</Label>
                  <Input
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </FormGroup>

                <Button color="success" block type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" /> : "Upload Image"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* RIGHT: Location Info */}
        <Col md={6}>
          <Card className="p-4 locationDisplay">
            <CardBody className="text-center">
              <h3 className="register-title">📍 Your Location Info</h3>
              <Location />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
