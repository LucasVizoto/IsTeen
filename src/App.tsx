import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {HomePage} from './pages/Home';

function App() {
  const router = createBrowserRouter([
    { path: '/',
      element: <HomePage/>
    },
    {
      path: '/about',
      element: ''
    }
  ])

  return (
      <RouterProvider router={router}/>
  )
}

export default App;
