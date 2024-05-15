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
import { useAuthContext } from "./context/AuthContext";
import QnAList from './pages/QnAList';
import { SuccessPage } from './components/toss/Success';
import { FailPage } from './components/toss/Fail';
import { CheckoutPage } from './components/toss/Checkout';
import Order from './pages/OrderPage';
import OrderHistoryList from './pages/OrderHistoryList';
import ItemListSearch from './pages/ItemListSearch';
import MainPage from './pages/MainPage';
import AdminOrderHistoryList from './pages/AdminOrderHistoryList';
import DashboardPage from './pages/DashBoardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'itemlist', element: <ItemList /> },
      { path: 'itemlist/:searchQuery', element: <ItemListSearch /> },
      { path: 'item/detail/:iid', element: <ItemDetail /> },
      { path: 'cart', element: <CartPage/> },
      { path: 'signIn', element: <SignIn/> },
      { path: 'signUp', element: <SignUp/> },
      { path: 'userInfo', element: <UserInfo/> },
      { path: 'userUpdate', element: <UserUpdate/> },
      { path: 'callback/kakaotalk', element: <Kakao/> },
      { path: 'wish/list', element: <WishItemList/> },
      { path: 'order', element: <Order/> },
      { path: 'orderHistoryList', element: <OrderHistoryList/> },
      { path: 'admin/itemlist', element: <AdminItemLists /> },
      { path: 'admin/item/insert', element: <ItemInsertAdminRoutes /> },
      { path: 'admin/item/update/:iid', element: <ItemUpdateAdminRoutes/> },
      { path: 'admin/QnAlist', element: <AdminQnAList/> },
      { path: 'admin/order/list', element: <AdminOrderLists /> },
      { path: 'admin/chart', element: <Dashboard /> },
      { path: 'success', element: <SuccessPage/> },
      { path: 'fail', element: <FailPage/> },
      { path: 'checkout', element: <CheckoutPage/> },
    ]
  }
]);

function AdminItemLists() {
  const { user } = useAuthContext(); 
  return user && user.isAdmin ? <AdminItemList /> : <MainPage />;
}

function AdminQnAList() {
  const { user } = useAuthContext();
  return user && user.isAdmin ? <QnAList /> : <MainPage />;
}

function ItemInsertAdminRoutes() {
  const { user } = useAuthContext(); 
  return user && user.isAdmin ? <ItemInsert /> : <MainPage />;
}

function ItemUpdateAdminRoutes() {
  const { user } = useAuthContext();
  return user && user.isAdmin ? <ItemUpdate /> : <MainPage />;
}

function AdminOrderLists() {
  const { user } = useAuthContext(); 
  return user && user.isAdmin ? <AdminOrderHistoryList /> : <MainPage />;
}

function Dashboard() {
  const { user } = useAuthContext(); 
  return user && user.isAdmin ? <DashboardPage /> : <MainPage />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
