import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

//context
import { useContext } from "react";
import DataContext from "../../context/DataContext";

//components
import RecipeItem from "../../components/RecipeItem"

//utils
import handleSave from "../../utils/handleSave";


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
                <NavLink to="/">Recipe List</NavLink>
              </div>
            ) : !recipes || recipes.length === 0 ? (
              <div className="loading-card">
                <h2>Loading...</h2>
              </div>
            ) : (
              recipes.map(recipe => (
                <RecipeItem key={recipe.id} recipe={recipe} handleSave={handleSave} user={user} dispatch={dispatch} savedRecipes={savedRecipes} navigate={navigate}/>
              ))
            )
            }
        </div>
    )

}