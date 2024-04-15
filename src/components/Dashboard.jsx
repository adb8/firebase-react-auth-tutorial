import { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const attemptLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      setError("Failed to log out");
      console.log(error);
    }
  };

  const getAccountAge = () => {
    const accountCreationTime = new Date(currentUser.metadata.creationTime);
    const now = new Date();
    const accountAgeInMilliseconds = now - accountCreationTime;
    const accountAgeInDays = Math.floor(accountAgeInMilliseconds / (1000 * 60 * 60 * 24));
    return accountAgeInDays;
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Email: {currentUser.email}</p>
          <p>Account age: {getAccountAge()} days</p>
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={attemptLogout}>
          Log out
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
