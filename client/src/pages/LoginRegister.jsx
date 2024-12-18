import React, {useState} from "react";
import {useNavigate } from "react-router-dom";

//context
import { useContext } from "react";
import DataContext from "../context/DataContext";

export default function LoginRegister() {
    // Using the useContext hook to access global state and dispatch from the DataContext
    const {dispatch} = useContext(DataContext)
    //Hook to navigate users
    const navigate = useNavigate();

    //state for handling auth method change (login/register)
    const [isSignUp, setAuthMethod] = useState(false)
    //state for authentication button loading process
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })
    
    //error state for showing error
    const [error, setError] = useState(null) 
    
    //changing state everytime input changes
    function handleInputChange(event) {
        const {name, value} = event.target
        setUserInfo(prevValue => (
            {...prevValue, [name]: value}
        )) 
    }
    
    async function handleSubmit() { 
        setIsAuthenticating(true)
        try {
            if (!userInfo.email || !userInfo.password ) {
                setIsAuthenticating(false)
                setError("Each input should be completed")
                return
            } else if (!userInfo.email.includes("@") || userInfo.email.length < 3 || /[A-Z]/.test(userInfo.email) || /[!#$%^&*(),?":{}|<>]/.test(userInfo.email) ) {
                setIsAuthenticating(false)
                setError("The email address is invalid")
                return
            } else if (userInfo.password.length < 4 || !/[A-Z]/.test(userInfo.password) || !/[a-z]/.test(userInfo.password) || !/[!#$%^&*(),?":{}|<>]/.test(userInfo.password)) {
                setIsAuthenticating(false)
                setError("The password should contain at least one upppercase and lowercase letter, one number, and one special character")
                return
            }

            //if email and password are valid proceeds with auth
            const response = await fetch(`http://localhost:8000/${!isSignUp ? "login" : "register"}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userInfo)
            });
            //checks for errors responses
            if (!response.ok) {
                const {error} = await response.json()
                setError(error)
                setUserInfo({email: "", password: ""})
            } else {
            setError(null) //clear error state (if exists)
            const {user: {email, recipesIds}} = await response.json()
            
            //Dispatches an action to update the state with isLoggedIn = true, and user's email
            dispatch({
                type: "AUTHENTICATION_SUCCESS",
                payload: {
                    user: email,
                    savedRecipes: recipesIds
                }
            })
            navigate("/profile", {replace: true})
            }
        } catch (err) {
            console.error(err.message)
            navigate("/error", {replace:true, status: err.message})
        }
 
    }

    return (
        <div className="login-register-container">
            <p>{error ? error : null}</p>
            <h2>{!isSignUp ? "Sign in to your account" : "Create a new account"}</h2>
            <div className="input-card">
                <label htmlFor="email">Email</label>
                <input 
                    name="email" 
                    id="email" 
                    value={userInfo.email} 
                    onChange={handleInputChange}
                ></input>
                <label htmlFor="password">Password</label>
                <input
                    name="password" 
                    id="password" 
                    value={userInfo.password} 
                    onChange={handleInputChange}
                ></input>
            </div>
            <button onClick={() => (handleSubmit())}>{!isAuthenticating ? "Submit" : "Authenticating..."}</button>
            <hr/>
            <p className="change-auth-paragraph">{!isSignUp ? "Don't have an account?" : "Already have an account?"}</p>
            <button onClick={() => (setAuthMethod((prevValue) => !prevValue))}>{!isSignUp ? "Sign Up" : "Sign in"}</button>

        </div>
    )
}