import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Progress, Input, Button, FormGroup, Label, Form } from "reactstrap";

const SavingsSummary = () => {
  const [entries, setEntries] = useState([]);
  const [goal, setGoal] = useState(1000); // Default goal
  const [newGoal, setNewGoal] = useState("");

  const userEmail = useSelector((state) => state.users.user.email);

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        if (userEmail) {
          const response = await axios.get(`http://localhost:3001/getUserSavings/${userEmail}`);
          setEntries(response.data);
        }
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };

    fetchSavings();

    // Load saved goal from localStorage
    const savedGoal = localStorage.getItem("userGoal");
    if (savedGoal) {
      setGoal(Number(savedGoal));
    }
  }, [userEmail]);

  const totalIncome = entries.reduce((acc, curr) => acc + Number(curr.salary), 0);
  const totalExpense = entries.reduce((acc, curr) => acc + Number(curr.totalExpenses), 0);
  const currentSavings = totalIncome - totalExpense;
  const progress = goal !== 0 ? ((currentSavings / goal) * 100).toFixed(2) : 0;

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (newGoal > 0) {
      setGoal(Number(newGoal));
      localStorage.setItem("userGoal", newGoal);
      setNewGoal("");
    } else {
      alert("Please enter a valid goal greater than 0.");
    }
  };

  const handleResetGoal = () => {
    localStorage.removeItem("userGoal");
    setGoal(1000); // Reset to default
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
      <Form onSubmit={handleGoalSubmit}>
        <FormGroup>
          <Label for="goal" className="mb-2"><strong>🐑 Set Your Sheep Savings Goal (OMR):</strong></Label>
          <Input
            type="number"
            id="goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter your goal..."
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

      <p><strong>Total Income:</strong> OMR {totalIncome.toFixed(2)}</p>
      <p><strong>Total Expenses:</strong> OMR {totalExpense.toFixed(2)}</p>
      <p><strong>Current Savings:</strong> OMR {currentSavings.toFixed(2)}</p>
      <p><strong>Goal Progress:</strong> {progress}%</p>

      <Progress value={progress} color="success" style={{ height: "25px", marginBottom: "10px" }}>
        {progress}% toward 🐑 Goal of {goal} OMR
      </Progress>

      {/* Motivational message */}
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#4CAF50", marginTop: "10px" }}>
        {getMotivationalMessage()}
      </p>
    </div>
  );
};

export default SavingsSummary;
