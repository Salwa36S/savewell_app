import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Button, Input,
  FormGroup, Label, Form, Card, CardBody,
  CardTitle, CardText, Progress, Spinner
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import backgroundImage from "../Images/backgroud.jpg";
import "../App.css";

const Home = () => {
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.users.user.email);
  const userName = useSelector((state) => state.users.user.name);

  const [salary, setSalary] = useState("");
  const [electricity, setElectricity] = useState("");
  const [water, setWater] = useState("");
  const [household, setHousehold] = useState("");
  const [personal, setPersonal] = useState("");
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  const [goal, setGoal] = useState(1000); // default goal

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/getUserSavings/${userEmail}`);
        const total = response.data.reduce((acc, item) => acc + Number(item.remaining), 0);
        setTotalRemaining(total);
      } catch (error) {
        console.error("Error fetching your savings", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchSavings();
    }

    const userGoal = localStorage.getItem(`goal_${userEmail}`);
    if (userGoal) setGoal(Number(userGoal));
  }, [userEmail]);

  const handleSave = async (e) => {
    e.preventDefault();
    const totalExpenses = +electricity + +water + +household + +personal;
    const remaining = +salary - totalExpenses;

    const newEntry = {
      userName: userName || "Anonymous",
      userEmail,
      salary,
      electricity,
      water,
      household,
      personal,
      totalExpenses,
      remaining,
    };

    try {
      await axios.post("http://localhost:3001/submitSaving", newEntry);
      alert("✅ Saving submitted successfully!");
      navigate("/savings");
    } catch (error) {
      console.error("Saving error:", error);
      alert("❌ Error submitting saving. Try again.");
    }
  };

  const progress = goal ? ((totalRemaining / goal) * 100).toFixed(2) : 0;

  return (
    <div
      className="register-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Container className="register-page py-5">
        <Row>
          <Col lg={12}>
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">🐑 Your Sheep Bank</CardTitle>
                {loading ? (
                  <Spinner color="primary" />
                ) : (
                  <>
                    <CardText><strong>Remaining:</strong> OMR {totalRemaining.toFixed(2)}</CardText>
                    <Progress value={progress} className="mt-3">
                      {progress}% of {goal} OMR
                    </Progress>
                  </>
                )}
              </CardBody>
            </Card>

            <div className="mb-4">
              <Button color="info" onClick={() => navigate("/savings")}>
                📄 View All Savings
              </Button>
            </div>

            <h2 className="mb-4">Monthly Budget Form</h2>
            <Form onSubmit={handleSave}>
              <FormGroup>
                <Label for="salary" className="register-label">Monthly Salary</Label>
                <Input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="electricity" className="register-label">Electricity Bill</Label>
                <Input type="number" value={electricity} onChange={(e) => setElectricity(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="water" className="register-label">Water Bill</Label>
                <Input type="number" value={water} onChange={(e) => setWater(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="household" className="register-label">Household Expenses</Label>
                <Input type="number" value={household} onChange={(e) => setHousehold(e.target.value)} required />
              </FormGroup>
              <FormGroup>
                <Label for="personal" className="register-label">Personal Use</Label>
                <Input type="number" value={personal} onChange={(e) => setPersonal(e.target.value)} required />
              </FormGroup>
              <Button color="success" block type="submit">
                Save
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
