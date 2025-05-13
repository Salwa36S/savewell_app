// src/Components/SavingsForm.js

import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, Button, Spinner
} from "reactstrap";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SavingsForm = () => {
  const [entries, setEntries] = useState([]);
  const [likedSavings, setLikedSavings] = useState([]);
  const [loading, setLoading] = useState(false);

  const userEmail = useSelector((state) => state.users.user.email);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (userEmail) {
          const [savingsResponse, likesResponse] = await Promise.all([
            axios.get(`http://localhost:3001/getUserSavings/${userEmail}`),
            axios.get(`http://localhost:3001/getLikedSavings/${userEmail}`),
          ]);
          setEntries(savingsResponse.data);
          setLikedSavings(likesResponse.data.map((like) => like.savingId._id));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail, location]);

  const toggleLike = async (savingId) => {
    try {
      if (likedSavings.includes(savingId)) {
        await axios.delete("http://localhost:3001/unlikeSaving", { data: { userEmail, savingId } });
        setLikedSavings(likedSavings.filter((id) => id !== savingId));
      } else {
        await axios.post("http://localhost:3001/likeSaving", { userEmail, savingId });
        setLikedSavings([...likedSavings, savingId]);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="mb-4">🐑 Your Sheep Savings</h2>

          {loading ? (
            <div className="text-center"><Spinner color="primary" /></div>
          ) : entries.length === 0 ? (
            <p className="text-center">No savings submitted yet. 🐑</p>
          ) : (
            entries.map((entry, index) => (
              <Card className="mb-3" key={entry._id}>
                <CardBody>
                  <CardTitle tag="h5">Saving #{index + 1}</CardTitle>

                  {[
                    ["Monthly Salary", entry.salary],
                    ["Electricity Bill", entry.electricity],
                    ["Water Bill", entry.water],
                    ["Household Expenses", entry.household],
                    ["Personal Use", entry.personal],
                    ["Total Expenses", entry.totalExpenses],
                    ["Remaining Salary", entry.remaining],
                  ].map(([label, value], idx) => (
                    <CardText key={idx}><strong>{label}:</strong> OMR {value}</CardText>
                  ))}

                  <Button
                    color={likedSavings.includes(entry._id) ? "danger" : "secondary"}
                    onClick={() => toggleLike(entry._id)}
                    className="mt-2"
                  >
                    {likedSavings.includes(entry._id) ? "❤️ Liked" : "🤍 Like"}
                  </Button>
                </CardBody>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SavingsForm;
