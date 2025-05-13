// src/Components/SavingsSummary.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Progress, Input, Button, FormGroup, Label, Form, Spinner } from "reactstrap";

const SavingsSummary = () => {
  const [entries, setEntries] = useState([]);
  const [goal, setGoal] = useState(1000);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const userEmail = useSelector((state) => state.users.user.email);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setLoading(true);
        if (userEmail) {
          const response = await axios.get(`http://localhost:3001/getUserSavings/${userEmail}`);
          setEntries(response.data);
        }
      } catch (error) {
        console.error("Error fetching savings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();

    const savedGoal = localStorage.getItem(`goal_${userEmail}`);
    if (savedGoal) setGoal(Number(savedGoal));
  }, [userEmail]);

  const totalRemaining = entries.reduce((acc, curr) => acc + Number(curr.remaining), 0);

  const progress = goal ? ((totalRemaining / goal) * 100).toFixed(2) : 0;

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (newGoal > 0) {
      setGoal(Number(newGoal));
      localStorage.setItem(`goal_${userEmail}`, newGoal);
      setNewGoal("");
    } else {
      alert("Please enter a valid goal greater than 0.");
    }
  };

  const handleResetGoal = () => {
    localStorage.removeItem(`goal_${userEmail}`);
    setGoal(1000);
    alert("Goal has been reset to 1000 OMR 🐑.");
  };

  const getMotivationalMessage = () => {
    if (progress >= 100) {
      return "🎉 Baaa-rilliant! Goal reached! 🐑🏆";
    } else if (progress >= 75) {
      return "💪 Almost there! Keep shepherding your savings!";
    } else if (progress >= 50) {
      return "✨ Good progress! Stay woolly and focused!";
    } else {
      return "🚀 Keep going, little sheep! 🐑 You can do it!";
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 className="mb-4">🐑 Savings Summary</h2>

      <Form onSubmit={handleGoalSubmit}>
        <FormGroup>
          <Label for="goal" className="mb-2">
            <strong>Set Your Sheep Savings Goal (OMR):</strong>
          </Label>
          <Input
            type="number"
            id="goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter your new goal..."
          />
        </FormGroup>
        <Button color="primary" type="submit" className="me-2">
          Set Goal
        </Button>
        <Button color="danger" type="button" onClick={handleResetGoal}>
          Reset Goal
        </Button>
      </Form>

      <hr />

      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-center">No savings data yet. Start saving to see your progress! 🐑</p>
      ) : (
        <>
          <p><strong>Total Remaining Saved:</strong> OMR {totalRemaining.toFixed(2)}</p>
          <p><strong>Goal Progress:</strong> {progress}%</p>

          <Progress
            value={progress}
            color={
              progress >= 100 ? "success" :
              progress >= 75 ? "info" :
              progress >= 50 ? "warning" :
              "danger"
            }
            style={{ height: "25px", marginBottom: "10px" }}
          >
            {progress}% toward 🐑 goal of {goal} OMR
          </Progress>

          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#4CAF50", marginTop: "10px" }}>
            {getMotivationalMessage()}
          </p>
        </>
      )}
    </div>
  );
};

export default SavingsSummary;
