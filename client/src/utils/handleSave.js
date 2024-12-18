
//handleSave function used in savedRecipes, RecipeList, RecipeItem
export default async function handleSave(event, recipeId, user, savedRecipes, dispatch, navigate) {
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
