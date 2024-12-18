import DataContext from "./DataContext"
import React, { useReducer } from "react"
import dataReducer from "../reducer/dataReducer"

// Initial state for the app's data
const initialState = {
    user: null,
    isLoggedIn: false,
    fetchedRecipes: null,
    singleRecipe: null,
    savedRecipes: [],
    error: null
}

// The DataProvider component wraps the entire app and provides access to the state through context
// It uses useReducer to manage the app's global state
export function DataProvider({children}) {
    const [state, dispatch] = useReducer(dataReducer,initialState)
    return (
        // Provide the state and dispatch function to all children components
        <DataContext.Provider value={{state, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}
