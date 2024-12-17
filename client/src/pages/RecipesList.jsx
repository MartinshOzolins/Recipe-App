import React, { useEffect, useState } from "react";

// MUI components
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

//context
import { useContext } from "react";
import DataContext from "../context/DataContext";

//Links
import {NavLink, useNavigate} from "react-router-dom"



export default function RecipesList() {
    const navigate = useNavigate()

    //Employing useContext to access the data from useReducer inside DataProvider
    const {state: { user, isLoggedIn, fetchedRecipes, singleRecipe, savedRecipes }, dispatch} = useContext(DataContext)


    //Search states
    const [searchInfo, setSearchInfo] = useState({
        input: "",
        pageNr: 1
    })
    function handleSearchChanges(e) {
        const name = e.target.name
        const value = e.target.value
        setSearchInfo((prevValue) => ({
                ...prevValue,
                [name]: value
            }))
    }
    function handlePageChanges(name) {
        let value = searchInfo.pageNr;
        if (name === "next" && value === 5 || name === "previous" && value === 1) {
            return
        }
        (name === "next" && value < 5 ? value += 1 : name === "previous" && value > 1)
        setSearchInfo((prevValue) => ({
            ...prevValue,
            pageNr: value
        }))
    }

    //fetches data from db and dispatches an action to update the state with the fetched data
    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:8000/recipes`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({input: searchInfo.input, pageNr: searchInfo.pageNr })
            });

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
        fetchData()
    }, [searchInfo.input, searchInfo.pageNr])


    // state for holding 10 recipes per page, slicing them for fetchedRecipes based on pageNr
    const [pageRecipes, setPageRecipes] = useState(null)
    useEffect(() => {
        const startIndex = searchInfo.pageNr === 1 ? searchInfo.pageNr - 1 : (searchInfo.pageNr -1) * 10
        setPageRecipes(fetchedRecipes.slice(startIndex, startIndex + 10))
        console.log(pageRecipes)
    }, [fetchedRecipes, searchInfo.pageNr])
    

    return (
        (!pageRecipes ? ( <h1>Loading recipes...</h1>) 
        : (
            <>
                <div className="search-container">
                    <input onChange={(e) => (handleSearchChanges(e))} name="input" className="search-input" value={searchInfo.input}></input>
                </div>
                {pageRecipes.length === 0 ? (<h2>No recipes found</h2>)
                : (
                    <>
                    <div className="recipe-list-container">
                        {pageRecipes.map((recipe) => {
                            return (
                                <NavLink to="recipe" onClick={() => dispatch({type: "CHECK_RECIPE", payload: recipe})} key={recipe.id}> 
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
                    <div className="list-page">
                        <KeyboardArrowLeftIcon name="previous" onClick={() => (handlePageChanges("previous"))}/>
                        <p className="page-nr" name="pageNr">{searchInfo.pageNr}</p>
                        <KeyboardArrowRightIcon name="next" onClick={() => (handlePageChanges("next"))}/>
                    </div>
                    </>
                )}
                
            </>
        ))
        
    );
}


//handleSubmit function used in savedRecipes list as well
export async function handleSubmit(event, recipeId, user, savedRecipes, dispatch, navigate) {
    event.stopPropagation() //When the button is clicked, event.stopPropagation() prevents the event from bubbling up to the parent elements. It stopps it from going up to the NavLink's event handler attribute(onClick) and triggering the navigation.
    event.preventDefault() //Prevents default behaviour of navigating to another page


    if (!user) {
        return navigate("/authentication", {replace: true})
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
