import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner,
} from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const SavingsForm = () => {
  const [entries, setEntries] = useState([]);
  const [likedUsers, setLikedUsers] = useState({});
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
        console.error("Error fetching savings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavings();

    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    setLikedUsers(likes);
  }, [userEmail]);

  const toggleLike = (id) => {
    const updatedLikes = { ...likedUsers, [id]: !likedUsers[id] };
    setLikedUsers(updatedLikes);
    localStorage.setItem("likes", JSON.stringify(updatedLikes));
  };

  const handleClearLikes = () => {
    localStorage.removeItem("likes");
    setLikedUsers({});
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="mb-4">🐑 Your Sheep Savings</h2>

          <Button color="warning" onClick={handleClearLikes} className="mb-4">
            Clear Likes
          </Button>

          {loading ? (
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-center">No savings submitted yet. Start saving now! 🐑</p>
          ) : (
            entries.map((entry, index) => (
              <Card className="mb-3" key={entry._id}>
                <CardBody>
                  <CardTitle tag="h5">
                    🐑 Sheep Saving #{index + 1}
                  </CardTitle>

                  <CardText><strong>Monthly Salary:</strong> OMR {entry.salary}</CardText>
                  <CardText><strong>Electricity Bill:</strong> OMR {entry.electricity}</CardText>
                  <CardText><strong>Water Bill:</strong> OMR {entry.water}</CardText>
                  <CardText><strong>Household Expenses:</strong> OMR {entry.household}</CardText>
                  <CardText><strong>Personal Use:</strong> OMR {entry.personal}</CardText>
                  <CardText><strong>Total Expenses:</strong> OMR {entry.totalExpenses}</CardText>
                  <CardText><strong>Remaining Salary:</strong> OMR {entry.remaining}</CardText>

                  <Button
                    color={likedUsers[entry._id] ? "danger" : "secondary"}
                    onClick={() => toggleLike(entry._id)}
                    className="mt-2"
                  >
                    {likedUsers[entry._id] ? "❤️ Liked" : "🤍 Like"}
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
