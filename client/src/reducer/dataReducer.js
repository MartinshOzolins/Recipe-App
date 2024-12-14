

export default function dataReducer(state, action) {
    switch (action.type) {
        case "FETCH_RECIPES":
            return {...state, fetchedRecipes: action.payload}
        case "CHECK_RECIPE":
            return {...state, singleRecipe: action.payload}
        case "AUTHENTICATION_SUCCESS":
            const {user, savedRecipes} = action.payload
            return {...state, user: user, isLoggedIn: true, savedRecipes: savedRecipes}
        case "LOG_OUT":
            return {...state, user: null, isLoggedIn: false, savedRecipes: null}
        case "UPDATE_SAVED_RECIPES_LIST":
            return {...state, savedRecipes: action.payload }
        default:
            return state
    }
    
}