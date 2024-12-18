import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function ErrorComponent() {
    const navigate = useNavigate()
    const location = useLocation(); //allows to acces state set in the navigate hook
    const message = location.state?.message 
    useEffect(() => {
        if (!message) {
            navigate("/", {replace: true})
        } 
    }, [message])

    return message ? (
        <div className="error-card">
            <h1>Error Occurred</h1>
            <h3>{message}</h3>
            <NavLink to="/">Return to Home</NavLink>
        </div>
    ) : null;
}