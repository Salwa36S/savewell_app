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
  Alert
} from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import backgroundImage from "../Images/backgroud.jpg"; // ✅ Correct spelling
import "../App.css";


const Feedback = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const user = useSelector((state) => state.users.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/submitFeedback", {
        userName: user.name,
        userEmail: user.email,
        rating,
        feedbackText: message,
      });

      setMessage("");
      setRating(0);
      setSubmitted(true);

      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)", // 🌟 blurred background effect
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4" style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)", // semi-transparent
              borderRadius: "15px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
              animation: "fadeIn 1s ease-in-out" // smooth appear animation
            }}>
              <CardBody>
                <CardTitle tag="h3" className="text-center mb-4" style={{ color: "#4CAF50", fontWeight: "bold" }}>
                  📝 Share Your Feedback
                </CardTitle>

                {submitted && (
                  <Alert color="success" className="text-center" fade={true}>
                    🎉 Thank you for your valuable feedback!
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Rating Field */}
                  <FormGroup>
                    <Label for="rating" style={{ fontWeight: "600" }}>Rate Your Experience:</Label>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          type="button"
                          color={rating >= star ? "warning" : "secondary"}
                          onClick={() => setRating(star)}
                          style={{
                            margin: "5px",
                            fontSize: "26px",
                            borderRadius: "50%",
                            transition: "transform 0.2s",
                            transform: rating >= star ? "scale(1.2)" : "scale(1)",
                          }}
                        >
                          ⭐
                        </Button>
                      ))}
                    </div>
                  </FormGroup>

                  {/* Message Field */}
                  <FormGroup>
                    <Label for="message" style={{ fontWeight: "600" }}>Your Message:</Label>
                    <Input
                      id="message"
                      type="textarea"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="We value your suggestions..."
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </FormGroup>

                  <Button
                    color="success"
                    type="submit"
                    disabled={rating === 0}
                    block
                    style={{
                      marginTop: "20px",
                      padding: "12px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
                  >
                    {rating === 0 ? "Select Rating First" : "Submit Feedback"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Feedback;
