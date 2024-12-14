import React from "react"; 

import { NavLink } from "react-router-dom";

//context
import { useContext } from "react";
import DataContext from "../context/DataContext";


export default function Header() {
    // Using the useContext hook to access global state and dispatch from the DataContext
    const {state: { isLoggedIn }} = useContext(DataContext)

    return (
        <nav>
            <div className="nav-left">
                <NavLink className="home-page-link" to="/">MealMap</NavLink>
            </div>
            <div className="nav-right">
                {!isLoggedIn ? (
                <NavLink className="authenticaiton-link" to="authentication" >Sign Up</NavLink>
                
                ) : (
                <NavLink className="profile-page-link" to="profile">Profile</NavLink>
                )}
            </div>

                

        </nav>
    )
}