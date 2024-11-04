import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {Home} from './pages'
import './App.css'
import { Toaster } from 'sonner'
const router = createBrowserRouter([
  { path: '/',
    element: <Home/>
  },
  {
    path: '/about',
    element: ''
  }
])
function App() {

  return (
    <RouterProvider router={router}/>
    <Toaster invert richColors/>
  )
}

export default App
