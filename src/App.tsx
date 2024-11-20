import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {HomePage} from './pages/Home';
import { AboutGame } from './pages/AboutGame';

function App() {
  const router = createBrowserRouter([
    { path: '/',
      element: <HomePage/>
    },
    { 
      path: '/view/:id',
      element: <AboutGame/>
    }
  ])

  return (
      <RouterProvider router={router}/>
      
  )
}

export default App;
