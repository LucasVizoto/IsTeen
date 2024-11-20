import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {HomePage} from './pages/Home';
import { GameInfo } from './pages/GameInfo';

import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
function App() {
  const router = createBrowserRouter([
    { path: '/',
      element: <HomePage/>
    },
    { 
      path: '/view/:id',
      element: <GameInfo/>
    }
  ])

  return (
      <RouterProvider router={router}/>
      
  )
}

export default App;
