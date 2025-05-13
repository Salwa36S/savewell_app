// src/Components/Home.js

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
  const [goal, setGoal] = useState(1000);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoading(true);
        if (userEmail) {
          const response = await axios.get(`http://localhost:3001/getUserSavings/${userEmail}`);
          const total = response.data.reduce((acc, item) => acc + Number(item.remaining), 0);
          setTotalRemaining(total);
        }
      } catch (error) {
        console.error("Error fetching your savings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();
    const userGoal = localStorage.getItem(`goal_${userEmail}`);
    if (userGoal) setGoal(Number(userGoal));
  }, [userEmail]);

  const handleSave = async (e) => {
    e.preventDefault();
    const totalExpenses = +electricity + +water + +household + +personal;
    const remaining = +salary - totalExpenses;

    const cleanUserName = (userName || "Anonymous").trim();
    const cleanUserEmail = userEmail.trim();

    const newEntry = {
      userName: cleanUserName,
      userEmail: cleanUserEmail,
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

      setSalary("");
      setElectricity("");
      setWater("");
      setHousehold("");
      setPersonal("");

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
                    <CardText><strong>Total Remaining Saved:</strong> OMR {totalRemaining.toFixed(2)}</CardText>
                    <Progress
                      value={progress}
                      className="mt-3"
                      color={progress >= 100 ? "success" : progress >= 75 ? "info" : progress >= 50 ? "warning" : "danger"}
                    >
                      {progress}% toward {goal} OMR Goal
                    </Progress>
                  </>
                )}
              </CardBody>
            </Card>

            <Button color="info" className="mb-4" onClick={() => navigate("/savings")}>
              📄 View All Savings
            </Button>

            <h2 className="mb-4">Monthly Budget Form</h2>
            <Form onSubmit={handleSave}>
              {[
                { label: "Monthly Salary", value: salary, setter: setSalary },
                { label: "Electricity Bill", value: electricity, setter: setElectricity },
                { label: "Water Bill", value: water, setter: setWater },
                { label: "Household Expenses", value: household, setter: setHousehold },
                { label: "Personal Use", value: personal, setter: setPersonal },
              ].map(({ label, value, setter }, idx) => (
                <FormGroup key={idx}>
                  <Label>{label}</Label>
                  <Input type="number" value={value} onChange={(e) => setter(e.target.value)} required />
                </FormGroup>
              ))}

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
