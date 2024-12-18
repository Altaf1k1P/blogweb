import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Store, {persistor} from "./store/Store.js"
import {Provider} from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import {createBrowserRouter,
  RouterProvider,} from "react-router-dom"
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import AddPost from './components/AddPost.jsx'
// import MyPost from './component/MyPost.jsx'
// import EditPost from './component/EditPost.jsx'
import AuthLayout from "./components/authLayout.jsx";
import PostDetails from './components/PostDetails.jsx'
import MyPosts from './components/MyPosts.jsx'
import EditPost from './components/EditPost.jsx'

  const router = createBrowserRouter([
    {
      path: '/',
      element:
        <App />,
      children: [
        {
          path: '/signup',
          element: <Signup />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/',
          element: 
              <Home />
          
          ,
        },
         {
          path: '/my-post/:userId',
          element: <AuthLayout>
              <MyPosts/>
          </AuthLayout>
          ,
        },
        {
          path: '/add-post',
          element: <AuthLayout>
              <AddPost />
          </AuthLayout>
          ,
        },
        {
          path: 'edit-post/:id',
          element: <AuthLayout>
              <EditPost />
          </AuthLayout>
          ,
        },
        {
          path: '/:id',
          element:  <PostDetails />
        }
      ],
    }
  ])

createRoot(document.getElementById('root')).render(
 
    <Provider store={Store}> 
    <StrictMode>
     <PersistGate loading={false} persistor={persistor}>
       <RouterProvider router={router}/>
      </PersistGate>
      </StrictMode>
    </Provider>
  ,
)
