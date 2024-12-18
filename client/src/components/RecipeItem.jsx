import React from "react";

import { NavLink } from "react-router-dom";

//MUI components
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function RecipeItem({recipe, handleSave, user, dispatch, navigate, savedRecipes}) {

    return (
        <NavLink to="/recipe" onClick={() => dispatch({type: "CHECK_RECIPE", payload: recipe})}> 
            <div className="recipe-item">
                <img src={recipe.image} alt={recipe.name}/>
                <div className="recipe-info-container"> 
                    <h3>{recipe.name}</h3>
                    <div className="prep-info-and-button-container">
                        <div className="preparation-info-container">
                            <p><RestaurantMenuIcon/>{recipe.difficulty}</p>
                            <p><AccessTimeIcon/>{recipe.prepTimeMinutes}</p>
                        </div>
                        {savedRecipes.length > 0 && savedRecipes.find((id) => id === recipe.id) ? (
                            <button className="delete-button" onClick={(event) => handleSave(event, recipe.id, user, savedRecipes, dispatch, navigate)}>REMOVE</button>
                        ) : (
                            <button className="save-button" onClick={(event) => handleSave(event, recipe.id, user, savedRecipes, dispatch, navigate)}>SAVE</button> 
                        )}  
                        
                    </div>
                </div>    
            </div>
        </NavLink>
    )
}
