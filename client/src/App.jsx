import React from 'react'

// Import components and router-related functions from 'react-router-dom'
import { 
  Route,
  Routes,
  useLocation, 
} from 'react-router-dom'


//pages
import RecipesList from '../src/pages/RecipesList'
import LoginRegister from './pages/LoginRegister'
import ErrorComponent from "../src/components/Error/ErrorComponent"
import Profile from "./pages/profile/Profile"

//context
import { DataProvider } from './context/DataProvider'
import RecipeDetails from './pages/RecipeDetails'


//components
import Footer from "../src/components/Footer"
import Header from "../src/components/Header"



export default function App() {

  return (
    // Wrap the whole app in the DataProvider context to provide global state
    <DataProvider>
        <header>
          <Header />
        </header>
        <main>
          <Routes>
              <Route index="/" element={<RecipesList />}/>
              <Route path="recipe" element={<RecipeDetails/>}/>
              {/* Dynamic part of the route /:mode, accessed in LoginRegister component for login/register modes */}
              <Route path="authentication" element= {<LoginRegister/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="error" element={<ErrorComponent/>}/>
          </Routes>
        </main>
        <footer>
          <Footer />
        </footer>

    </DataProvider>

  )
}







