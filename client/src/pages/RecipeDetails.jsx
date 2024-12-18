import React, { useEffect } from "react"

//context
import { useContext } from "react";
import DataContext from "../context/DataContext";

//Links
import {useNavigate} from "react-router-dom"

//MUI components
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

export default function RecipeDetails() {
    //Hook to navigate users
    const navigate = useNavigate()
    const {state: {singleRecipe }} = useContext(DataContext)

    useEffect(() => {
        (!singleRecipe && navigate("/", {replace: true}))
    }, [singleRecipe]) 

    return (
        <>
        {singleRecipe ?  
            <div className="recipe-details-container">
                <div className="recipe-header-container">
                        <img src={singleRecipe.image} alt={singleRecipe.name} />
                    <div>
                        <h2>{singleRecipe.name}</h2>
                        <p><PublicIcon/>{singleRecipe.cuisine}</p>
                        <p><RestaurantMenuIcon/>{singleRecipe.difficulty}</p>
                        <p><AccessTimeIcon/>{singleRecipe.prepTimeMinutes} min</p>
                    </div>
                </div>
                <div className="ingredients-insutrctions-container">
                    <div className="ingredients-card">
                        <h3>INGREDIENTS:</h3>
                        <ol>    
                            {singleRecipe.ingredients.map((ingredient, index) => (<li key={index}>{ingredient}</li>))}
                        </ol>
                    </div>
                    <div className="instructions-card">
                        <h3>INSTRUCTIONS:</h3>
                        <ol>    
                            {singleRecipe.instructions.map((instruction, index) => (<li key={index}>{instruction}</li>))}
                        </ol>
                    </div>
                </div>  
            </div>
        : null}
        </>
    )
}

