import React, { useEffect, useState } from "react";

// MUI components
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
//context
import { useContext } from "react";
import DataContext from "../context/DataContext";
//Links
import {useNavigate} from "react-router-dom"
//components
import RecipeItem from "../components/RecipeItem";
//utils
import handleSave from "../utils/handleSave"

export default function RecipesList() {
    //Hook to navigate users
    const navigate = useNavigate()

    // uses useContext to access the data from useReducer inside DataProvider
    const {state: { user, fetchedRecipes, savedRecipes }, dispatch} = useContext(DataContext)

    //Search states
    const [searchInfo, setSearchInfo] = useState({
        input: "",
        currentPageNr: 1
    })

    // state for managing 10 recipes per page, slicing them for fetchedRecipes based on currentPageNr
    const [pageRecipes, setPageRecipes] = useState(null)

    // state for managing available pages
    const [isNextPageAvailable, setNextPage] = useState(false)

    // updates searchInfo state every time input changes
    function handleSearchChanges(e) {
        const name = e.target.name
        const value = e.target.value
        setSearchInfo((prevValue) => ({
                ...prevValue,
                [name]: value
            }))
    }
    //fetches data from db and dispatches an action to update the state with the fetched data
    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:8000/recipes`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({input: searchInfo.input, currentPageNr: searchInfo.currentPageNr })
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
    // once component gets mounted, useEffect executes fetchData() function and then only if dependencies change
    useEffect(() => {
        fetchData()
        setSearchInfo((prevValue) => ({...prevValue, currentPageNr: 1}))
    }, [searchInfo.input])

    // sets  startIndex, endIndex, and checks for availability of recipes to switch page
    function calculatePagination(fetchedRecipes) {
        const currentPageNr = searchInfo.currentPageNr
        
        const startIndex = currentPageNr === 1? (currentPageNr - 1) : (searchInfo.currentPageNr - 1) * 10
        const endIndex = startIndex + 10;
        const hasNextPage = endIndex < fetchedRecipes.length 
        return {startIndex, endIndex, hasNextPage}
    }
    // manages page changes and triggers useEffect below
    function handlePageChanges(direction) {
        const currentPageNr = searchInfo.currentPageNr;
        const nextPageNr = (direction === "next" ? currentPageNr + 1 : currentPageNr - 1)

        // prevents going below page 1
        if (nextPageNr < 1 ) return;

        // checks for availability of next page, and also does not prevent navigation to previous pages
        if (direction === "next") {
            // calculates pagination for forward navigation
            const {hasNextPage} = calculatePagination(fetchedRecipes)
            setNextPage(hasNextPage)
            if (!hasNextPage) return
        }

        // updates currentPageNr and triggers useEffect, which updates pageRecipes
        setSearchInfo((prevValue) => ({
            ...prevValue,
            currentPageNr: nextPageNr
        }))
    }

    //updates pageRecipes once dependencies change
    useEffect(() => {
        if (!fetchedRecipes) {
            setPageRecipes(null)
            return //prevents setPageRecipes from changing pageRecipes to empty array, which would not show Loading recipes...
        }
        const {startIndex, endIndex, hasNextPage} = calculatePagination(fetchedRecipes)
        setNextPage(hasNextPage)
        setPageRecipes(fetchedRecipes.slice(startIndex, endIndex))
    }, [fetchedRecipes, searchInfo.currentPageNr])
    

    return (
        (!pageRecipes ? ( <h1>Loading recipes...</h1>) 
        : (
            <>
                <div className="search-container">
                    <input onChange={(e) => (handleSearchChanges(e))} name="input" className="search-input" value={searchInfo.input}></input>
                </div>
                {pageRecipes.length === 0 ? (
                    (<h2>No recipes found</h2>)
                )
                : (
                    <>
                    <div className="recipe-list-container">
                        {pageRecipes.map((recipe) => {
                            return (
                                <RecipeItem key={recipe.id} recipe={recipe} handleSave={handleSave} user={user} dispatch={dispatch} savedRecipes={savedRecipes} navigate={navigate}/>
                            )
                        })}
                    </div>
                    <div className="list-page">
                        <KeyboardArrowLeftIcon name="previous" onClick={() => (handlePageChanges("previous"))}/>
                        <p className="page-nr" name="currentPageNr">{searchInfo.currentPageNr}</p>
                        {isNextPageAvailable && <KeyboardArrowRightIcon name="next" onClick={() => (handlePageChanges("next"))}/>}
                    </div>
                </>
                )}
            </>
        ))
    );
}

