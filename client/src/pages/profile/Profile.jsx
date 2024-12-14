import React, { useEffect } from "react";

//context
import { useContext } from "react";
import DataContext from "../../context/DataContext";

//components
import SavedRecipes from "./SavedRecipes";
import {useNavigate } from "react-router-dom";

//MUI Components
import ContactMailIcon from '@mui/icons-material/ContactMail';

export default function Profile() {
    //Hook to navigate users
    const navigate = useNavigate();

    // Using the useContext hook to access global state and dispatch from the DataContext
    const {state: { user }, dispatch} = useContext(DataContext)
    
    function handleClick() {
        console.log("Dispatching")
        dispatch({type: "LOG_OUT"})
        navigate("/", {replace: true})
    }
    
    useEffect( () => {
        if (!user) {
            navigate("/", {replace: true}) 
        }
    }, [user])

    return (
        <div className="profile-container">
            {user 
            ? 
            <>
            <h2>Your Profile</h2>
            <h3><ContactMailIcon/> {user}</h3>
            <button className="profile-button"onClick={handleClick}>Log Out</button>
            <SavedRecipes/>
            </>
            : 
            null
            }
        </div>
    )
}