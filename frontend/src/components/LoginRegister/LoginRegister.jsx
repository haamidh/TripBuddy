import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./LoginRegister.css";

function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setErrorMessage("");
        setSuccessMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin
            ? "http://localhost:8000/auth/login/"
            : "http://localhost:8000/auth/register/";

        const payload = isLogin
            ? { username, password }
            : { username, email, password, password_confirmation: passwordConfirmation };

        try {
            const response = await axios.post(url, payload);

            if (isLogin && response.status === 200) {
                setSuccessMessage("Logged in successfully!");
                setErrorMessage("");

                // Store the token in localStorage
                localStorage.setItem("token", response.data.access);

                // Redirect to the dashboard after successful login
                navigate("/dashboard"); // Change "/dashboard" to your desired path
            } else if (!isLogin && response.status === 201) {
                setSuccessMessage("Registered successfully! Please log in.");
                setErrorMessage("");

                // Toggle back to the login form after successful registration
                setIsLogin(true); // Switch to the login form
                setUsername(""); // Clear the username field
                setPassword(""); // Clear the password field
            } else {
                setErrorMessage(response.data.detail || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(error.response?.data?.detail || "A network error occurred. Please try again later.");
        }
    };

    return (
        <div className="container">
            <div className={`wrapper ${isLogin ? "login-active" : "register-active"}`}>
                <div className="form-box">
                    <h2>{isLogin ? "Login" : "Register"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div className="input-box">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <button type="submit">{isLogin ? "Login" : "Register"}</button>
                    </form>
                    <div className="switch-link">
                        {isLogin ? (
                            <p>
                                Don't have an account?{" "}
                                <a href="#" onClick={toggleForm}>
                                    Register here
                                </a>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{" "}
                                <a href="#" onClick={toggleForm}>
                                    Login here
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginRegister;