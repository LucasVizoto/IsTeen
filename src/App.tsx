import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {HomePage} from './pages/Home';
import { GameList } from './components/GameList';

function App() {
  const router = createBrowserRouter([
    { path: '/',
      element: <HomePage/>
    },
    {
      path: '/view/:id',
      element: <GameList/>
    }
  ])

  return (
      <RouterProvider router={router}/>
  )
}

export default App;
