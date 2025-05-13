// src/Components/LikedSavingsPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner
} from "reactstrap";

const LikedSavingsPage = () => {
  const [likedSavings, setLikedSavings] = useState([]);
  const [loading, setLoading] = useState(false);

  const userEmail = useSelector((state) => state.users.user.email);

  useEffect(() => {
    fetchLikedSavings();
  }, [userEmail]);

  const fetchLikedSavings = async () => {
    try {
      setLoading(true);
      if (userEmail) {
        const response = await axios.get(`http://localhost:3001/getLikedSavings/${userEmail}`);
        setLikedSavings(response.data);
      }
    } catch (error) {
      console.error("Error fetching liked savings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLike = async (savingId) => {
    try {
      await axios.delete("http://localhost:3001/unlikeSaving", {
        data: { userEmail, savingId },
      });
      alert("❌ Like removed successfully!");

      // After removing, refresh the liked savings
      fetchLikedSavings();
    } catch (error) {
      console.error("Error removing like:", error);
      alert("Error removing like. Try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="mb-4 text-center">❤️ Your Liked Savings</h2>

          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : likedSavings.length === 0 ? (
            <p className="text-center">You haven't liked any savings yet. 🤔</p>
          ) : (
            likedSavings.map((like, index) => {
              const saving = like.savingId;
              if (!saving) return null;

              return (
                <Card className="mb-4 shadow-sm" key={like._id}>
                  <CardBody>
                    <CardTitle tag="h5" className="mb-3 text-primary">
                      🐑 Liked Saving #{index + 1}
                    </CardTitle>

                    <CardText><strong>Saved By:</strong> {saving.userName || "Unknown User"}</CardText>
                    <hr />

                    {[
                      ["Monthly Salary", saving.salary],
                      ["Electricity Bill", saving.electricity],
                      ["Water Bill", saving.water],
                      ["Household Expenses", saving.household],
                      ["Personal Use", saving.personal],
                      ["Total Expenses", saving.totalExpenses],
                      ["Remaining Salary", saving.remaining],
                    ].map(([label, value], idx) => (
                      <CardText key={idx}>
                        <strong>{label}:</strong> OMR {Number(value).toFixed(2)}
                      </CardText>
                    ))}

                    {/* 🗑 Remove Like Button */}
                    <Button
                      color="danger"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleRemoveLike(saving._id)}
                    >
                      ❌ Remove Like
                    </Button>
                  </CardBody>
                </Card>
              );
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LikedSavingsPage;
