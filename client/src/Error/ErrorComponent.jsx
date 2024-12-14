import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function ErrorComponent() {

    const location = useLocation(); //allows to acces state set in the navigate hook
    console.log(location)
    const message = location.state || "Unexpected Error"

    return (
        <div className="error-card">
            <h1>Error Occured</h1>
            <h3>{message}</h3>
            <NavLink to="/">Return to Home</NavLink>
        </div>
    )
}