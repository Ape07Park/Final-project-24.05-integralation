import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ItemList from './pages/ItemList';
import NotFound from './pages/NotFound';
import ItemInsert from './pages/ItemInsert';
import ItemDetail from './pages/ItemDetail';
import AdminItemList from './pages/AdminItemList';
import ItemUpdate from './pages/ItemUpdate';
import CartPage from './pages/CartPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserInfo from './pages/UserInfo';
import UserUpdate from './pages/UserUpdate';
import Kakao from './api/kakao';
import WishItemList from './pages/WishItemList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <ItemList /> },
      { path: 'itemlist', element: <ItemList /> },
      { path: 'itemlist/:searchQuery', element: <ItemList /> },
      { path: 'admin/item/insert', element: <ItemInsert /> },
      { path: 'item/detail/:iid', element: <ItemDetail /> },
      { path: 'admin/itemlist', element: <AdminItemList /> },
      { path: 'admin/item/update/:iid', element: <ItemUpdate/> },
      { path: 'cart', element: <CartPage/> },
      { path: 'signIn', element: <SignIn/> },
      { path: 'signUp', element: <SignUp/> },
      { path: 'userInfo', element: <UserInfo/> },
      { path: 'userUpdate', element: <UserUpdate/> },
      { path: 'callback/kakaotalk', element: <Kakao/> },
      { path: 'wish/list', element: <WishItemList/> },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
