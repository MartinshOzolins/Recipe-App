import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//context
import { useContext } from "react";
import DataContext from "../../context/DataContext";

// MUI components
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';


//handleSubmit function for handling save/delete
import {handleSubmit} from "../RecipesList"


export default function SavedRecipes() {
    const navigate = useNavigate()
    
    //Employing useContext to access the data from useReducer inside DataProvider
    const {state: {savedRecipes, user }, dispatch} = useContext(DataContext)    
    
    //Local state to store fetched recipe details
    const [recipes, setRecipes] = useState(null);


    useEffect(() => {
        if (!savedRecipes || savedRecipes.length === 0) {
          return; // Exit the effect early, skipping the fetch
      }
        // Fetching recipes when savedRecipes changes
        async function fetchRecipes() {
          try {
            // Fetching the data for each recipe from DummyJSON
            const fetchedRecipes = await Promise.all(
              savedRecipes.map(async (recipeId) => {
                const response = await fetch(`https://dummyjson.com/recipes/${recipeId}`);
                return await response.json();
              })
            );
            setRecipes(fetchedRecipes); // Store fetched recipes in state
          } catch (error) {
            console.error("Error fetching recipes:", error);
          }
        }
        fetchRecipes(); // Run the fetchRecipes function        
      }, [savedRecipes]);

    return (
        <div className="recipe-list-container">
            {
            !savedRecipes || savedRecipes.length === 0 ? (
              <div className="empty-card">
                <h2>No Recipes Saved</h2>
                <NavLink to="/">Go to Recipes List</NavLink>
              </div>
            ) : !recipes || recipes.length === 0 ? (
              <div className="loading-card">
                <h2>Loading...</h2>
              </div>
            ) : (
              recipes.map(recipe => (
              <NavLink to="/recipe" onClick={() => dispatch({type: "CHECK_RECIPE", payload:     recipe})} key={recipe.id}> 
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
              ))
            )
            }
        </div>
    )

}