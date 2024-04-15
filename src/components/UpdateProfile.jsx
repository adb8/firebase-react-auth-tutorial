import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { updateEmailFunc, updatePasswordFunc, logout } = useAuth();
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const passwordConfirm = passwordConfirmRef.current.value;

    if (!email && !password && !passwordConfirm) {
      return setError("No changes detected");
    } else if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    } else if (
      (password && (password.length < 6 || password.length > 20)) ||
      (passwordConfirm && (passwordConfirm.length < 6 || passwordConfirm.length > 20))
    ) {
      return setError("Password must be between 6 and 20 characters");
    }

    try {
      setError("");
      setEmailMessage("");
      setPasswordMessage("");
      setLoading(true);
      if (email) {
        await updateEmailFunc(email);
        setEmailMessage("Check your inbox to verify your new email address");
      }
      if (password) {
        await updatePasswordFunc(password);
        setPasswordMessage("Password updated successfully");
      }
      setSubmitted(true);
    } catch (error) {
      setError("Failed to apply changes");
      console.log(error);
    }
    setLoading(false);
  };

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

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {emailMessage && <Alert variant="success">{emailMessage}</Alert>}
          {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
          {!submitted && (
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  ref={emailRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Form.Group id="password" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Form.Group id="password-confirm" className="mt-2">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  placeholder="Leave blank to keep the same"
                />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Update
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {submitted ? <Link onClick={attemptLogout}>Log in again</Link> : <Link to="/">Cancel</Link>}
      </div>
    </>
  );
};

export default UpdateProfile;
