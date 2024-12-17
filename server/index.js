import express from "express";
import cors from "cors";
import axios from "axios";
import bcrypt from "bcrypt";

//database
import db from "./db.js";

const app = express();
const port = 8000;
const saltRounds = 12;

//Middleware
app.use(express.json());

//CORS
app.use(cors({
    origin: "http://localhost:5173" // Allow requests from the client side
}))

//input: searchInfo.input, recipesPerPage: searchInfo.recipesPerPage, pageNr: searchInfo.pageNr

//Routes
//GET RECIPES
app.post("/recipes", async (req, res) => {
    const {input, pageNr} = req.body;
    let skip = (pageNr - 1) * 10
    const request = (!input ? `?limit=10&skip=${skip}` : `search?q=${input}&limit=10&skip=${skip}`)
    console.log(request)
    try {
        //limit to only what is needed
        const response = await axios.get(`https://dummyjson.com/recipes/${request}`)

        if (response.status === 200) {
            const data = response.data.recipes;
            res.json(data)
        } else {
            res.status(response.status).json({error: "Server Error: Could not fetch data"})
        }

    } catch (err) {
        res.status(500).json({error: err.message})
        console.error(err.message)
    }
})




//REGISTER
app.post("/register", async (req, res) => {
    try {
        //requesting info from body object 
        const {email, password} = req.body;

        const existingUser = await db.query(`
            SELECT email FROM users
            WHERE email = $1
            `, [email]
        )
        if (existingUser.rows.length > 0) {
            return res.status(400).json({error: "Email already exists."})
        }

        //password hashing
        const hash = await bcrypt.hash(password, saltRounds) 

        const user = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING email", [
            email, hash
        ])

        res.json({ user: {
            email: user.rows[0].email,
            recipesIds: []
        }})

    } catch (err) {
        console.log(err.message) 
        return res.status(500).json({error: "Server Error"})
  
    }
})


//LOGIN
app.post("/login", async (req, res) => {
    try {
        //requesting info from body object 
        const {email, password} = req.body;
        
        const userInfoFromDB = await db.query(`
            SELECT users.email, users.password, saved_recipes.recipe_id 
            FROM users 
            LEFT JOIN saved_recipes ON users.id = saved_recipes.user_id 
            WHERE users.email = $1`, [
            email
        ]) //It returns the user email and password from the left table (users) and if no matching in the right table (saved_recipes), it returns (recipe_id: null)
        
        //checking if user exists
        if(userInfoFromDB.rows.length === 0) {
            return res.status(400).json({error: "An account with this email does not exist"})
        }

        //password check
        const isPasswordCorrect = await bcrypt.compare(password, userInfoFromDB.rows[0].password)

        //if incorrect password, return immediatelly
        if (!isPasswordCorrect) {
            return res.status(400).json({error: "Password does not match, try again."})
        }

        console.log(userInfoFromDB.rows)
        //if password correct
        let savedRecipesIds = userInfoFromDB.rows.map(({recipe_id}) => ((Number(recipe_id))) ) 
        //extracts the ids of recipes from each row using destructuring
        //if there are no recipes, db returns recipe_id: [null]
        // Number method removes quotes from numbers, if null, returns 0
        console.log(savedRecipesIds)


        if (savedRecipesIds[0] === 0) {
            savedRecipesIds = []
        }
        
        const user = {
            email: userInfoFromDB.rows[0].email,
            recipesIds: savedRecipesIds
        }
        res.json({user: user})
 
    } catch (err) {
        res.status(500).json({error: err.message})
        console.log(err.message)   
    }
})

//POST (save recipes)
app.post("/save", async (req, res) => {
    const {email, recipeId} = req.body;
    try {
        //SELECT userId with user's email
        const userId = await db.query(`
            SELECT id 
            FROM users 
            WHERE email = $1`, [email])
        //INSERT new recipe_id into saved_recipes
        await db.query(`
            INSERT INTO saved_recipes (recipe_id, user_id) 
            VALUES ($1, $2)
            `, [recipeId, userId.rows[0].id]
        )
        // SELECT updated list of savedRecipes
        const savedRecipesList = await db.query(`
            SELECT * FROM saved_recipes
            WHERE user_id = $1
        `, [userId.rows[0].id])
        
        //Extract the ids of recipes from each row using destructuring
        const updatedListOfRecipeIds = savedRecipesList.rows.map(({recipe_id}) => parseInt(recipe_id))
        
        //Response with new recipes array
        res.json({updatedListOfRecipeIds: updatedListOfRecipeIds}) 
        
    } catch (err) {
        console.log(err.message)
        res.status(500).json({error: "Server Error: Could not fetch data "})
    } 
    
    })



//DELETE (delete recipes)
app.delete("/delete", async (req, res) => {
    const {email, recipeId} = req.body;

    try {
        //SELECT userId with user's email
        const userId = await db.query(`
            SELECT id 
            FROM users 
            WHERE email = $1`, [email])

        //DELETE new recipe_id into saved_recipes
        await db.query(`
            DELETE FROM saved_recipes
            WHERE recipe_id = $1 AND user_id = $2
            `, [recipeId, userId.rows[0].id]
        )

        // SELECT updated list of savedRecipes
        const savedRecipesList = await db.query(`
            SELECT * FROM saved_recipes
            WHERE user_id = $1
        `, [userId.rows[0].id])

        //Extract the ids of recipes from each row using destructuring
        const updatedListOfRecipeIds = savedRecipesList.rows.map(({recipe_id}) => parseInt(recipe_id))
        //use parseInt to convert string to number 


        //Response with new recipes array
        res.json({updatedListOfRecipeIds: updatedListOfRecipeIds}) 
        
    } catch (err) {
        res.status(500).json({error: "Server Error: Could not fetch data "})
        console.log(err.message)
    } 
})




app.listen(port, () => {
    console.log("server listening on port", port)
})
