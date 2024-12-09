import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';


import './index.css'
import App from './App.jsx'
import Board from './Board/Board.jsx'
import LoginPage from './LoginPage.jsx';
import ErrorPage from './ErrorPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage></LoginPage>,
    errorElement: <ErrorPage></ErrorPage>
  },
  {
    path:'/board',
    element: <Board></Board>,
    errorElement: <ErrorPage></ErrorPage>
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
