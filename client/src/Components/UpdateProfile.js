import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
 
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [updated, setUpdated] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
     
      password,
      age,
      gender,
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedUser));
    setUpdated(true);

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ size: 8, offset: 2 }}>
          <Card>
            <CardBody>
              <CardTitle tag="h4">✏️ Update Profile</CardTitle>

              {updated && <Alert color="success">Profile Updated!</Alert>}

              <Form onSubmit={handleUpdate}>
                {/* Name Field */}
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormGroup>

              
               

                {/* Password Field */}
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>

                {/* Age Field */}
                <FormGroup>
                  <Label for="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </FormGroup>

                {/* Gender Field */}
                <FormGroup>
                  <Label for="gender">Gender</Label>
                  <Input
                    type="select"
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    
                  </Input>
                </FormGroup>

                <Button color="success" type="submit" className="w-100">
                  Update
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfile;
