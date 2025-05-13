import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";

const TopSavers = () => {
  const [topSavers, setTopSavers] = useState([]);

  useEffect(() => {
    const fetchTopSavers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getAllSavings");
        const sorted = response.data
          .sort((a, b) => b.remaining - a.remaining) // sort by remaining descending
          .slice(0, 3); // top 3 savers
        setTopSavers(sorted);
      } catch (error) {
        console.error("Error fetching savings:", error);
      }
    };

    fetchTopSavers();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>🏆 Top Savers</h2>
          {topSavers.map((saver, index) => (
            <Card key={saver._id} className="mb-3">
              <CardBody>
                <CardTitle tag="h5">
                  {index + 1}. {saver.userName || "Anonymous"}
                </CardTitle>
                <CardText>
                  <strong>Remaining:</strong> OMR {saver.remaining.toFixed(2)}
                </CardText>
              </CardBody>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default TopSavers;
