import React, { useEffect } from "react";

// MUI components
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

//context
import { useContext } from "react";
import DataContext from "../context/DataContext";

//Links
import {NavLink, replace, useNavigate} from "react-router-dom"

//pages


//handleSubmit function used in savedRecipes list as well
export async function handleSubmit(event, recipeId, user, savedRecipes, dispatch, navigate) {
    event.stopPropagation() //When the button is clicked, event.stopPropagation() prevents the event from bubbling up to the parent elements. It stopps it from going up to the NavLink's event handler attribute(onClick) and triggering the navigation.
    event.preventDefault() //Prevents default behaviour of navigating to another page

    if (!user) {
        return navigate("/authentication/login", {replace: true})
    }

    const isSaved = savedRecipes.find((id) => id === recipeId) //checking if recipe is already saved
    const method = !isSaved ? "POST" : "DELETE";
    const endpoint = !isSaved ? "save" : "delete";

    try {
        const response = await fetch(`http://localhost:8000/${endpoint}`,{
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: user, recipeId: recipeId})
        })
        const {updatedListOfRecipeIds} = await response.json()

        dispatch({
            type: "UPDATE_SAVED_RECIPES_LIST",
            payload: updatedListOfRecipeIds
        })

    } catch (err) {
        console.error(err.message)
        navigate("/error", {replace: true, state: {error: err.message}})
    }
}



export default function RecipesList() {
    const navigate = useNavigate()

    //Employing useContext to access the data from useReducer inside DataProvider
    const {state: { user, isLoggedIn, fetchedRecipes, singleRecipe, savedRecipes }, dispatch} = useContext(DataContext)

    //fetches data from db and dispatches an action to update the state with the fetched data
    async function fetchData() {
        try {
            const response = await fetch("http://localhost:8000/recipes");

            // in the range of 200-299
            if (response.ok) {
                const jsonData = await response.json()
                dispatch({
                    type: "FETCH_RECIPES",
                    payload: jsonData
                })
            } else {
                const error = await response.json()
                return (navigate("error", {replace: false, state: {message: error}} ))
            }
            
        } catch (err) {
            return (navigate("error", {replace: false, state: {message: err.message}} ))
        }
    }
    //Once component gets render, useEffect executes fetchData() function
    useEffect(() => {
        if (fetchedRecipes.length === 0) {
            fetchData()
        }
    }, [fetchedRecipes])



    return (
        <div className="recipe-list-container">
        {fetchedRecipes.map((recipe) => {
            return (
                // Links to the RecipeDetails component. Dispatches the clicked recipe's data to the useReducer state using the CHECK_RECIPE action, allowing the RecipeDetails component to access the selected recipe's details via useContext.
                <NavLink 
                to="recipe" 
                onClick={() => dispatch({type: "CHECK_RECIPE", payload: recipe})} key={recipe.id}
                > 
                    <div className="recipe-item">
                        <img src={recipe.image} alt={recipe.name}/>
                        <div className="recipe-info"> 
                            <h3>{recipe.name}</h3>
                            <div>
                                <div>
                                    <p><RestaurantMenuIcon/>{recipe.difficulty}</p>
                                    <p><AccessTimeIcon/>{recipe.prepTimeMinutes}</p>
                                </div>
                                {!user || savedRecipes.length === 0 
                                ? 
                                <button className="save-button" onClick={(event) => handleSubmit(event, recipe.id, user, savedRecipes, dispatch, navigate)}>SAVE</button> 
                                : 
                                savedRecipes.length > 0 && savedRecipes.find((id) => id === recipe.id) 
                                ?                               
                                <button className="delete-button" onClick={(event) => handleSubmit(event, recipe.id, user, savedRecipes, dispatch, navigate)}>REMOVE</button>
                                : 
                                <button className="save-button" onClick={(event) => handleSubmit(event, recipe.id, user, savedRecipes, dispatch, navigate)}>SAVE</button> 
                                }

                                
                                
                            </div>
                        </div>
                        
                    </div>
                </NavLink>
            )
        })}
        </div>
    );
}

