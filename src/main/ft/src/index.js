import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ItemList from './pages/item/ItemList';
import NotFound from './pages/NotFound';
import ItemInsert from './pages/admin/ItemInsert';
import ItemDetail from './pages/item/ItemDetail';
import AdminItemList from './pages/admin/AdminItemList';
import ItemUpdate from './pages/admin/ItemUpdate';
import CartPage from './pages/cart/CartPage';
import SignIn from './pages/user/SignIn';
import SignUp from './pages/user/SignUp';
import UserInfo from './pages/user/UserInfo';
import UserUpdate from './pages/user/UserUpdate';
import Kakao from './api/kakao';
import WishItemList from './pages/item/WishItemList';
import { useAuthContext } from "./context/AuthContext";
import QnAList from './pages/admin/QnAList';
import { SuccessPage } from './components/toss/Success';
import { FailPage } from './components/toss/Fail';
import { CheckoutPage } from './components/toss/Checkout';
import Order from './pages/order/OrderPage';
import OrderHistoryList from './pages/order/OrderHistoryList';
import ItemListSearch from './pages/item/ItemListSearch';
import MainPage from './pages/MainPage';
import AdminOrderHistoryList from './pages/admin/AdminOrderHistoryList';
import DashboardPage from './pages/admin/DashBoardPage';
import ProductAnalysis from './pages/admin/Productanalysis'
import NonMemberOrderHistory from './pages/order/NonMemberOrderHistory';
import ItemMenuList from './pages/item/ItemMenuList';
import DeveloperPage from './pages/DeveloperPage';

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
      { path: 'success', element: <SuccessPage/> },
      { path: 'fail', element: <FailPage/> },
      { path: 'checkout', element: <CheckoutPage/> },
      { path: 'nonMemberOrderHistory', element: <NonMemberOrderHistory/>},
      { path: 'itemMenuList/:menu', element: <ItemMenuList/>},
      { path: 'developerPage', element: <DeveloperPage/>},
      { path: 'admin/products', element: <ProductAnalysisPage/>},
      { path: 'admin/itemlist', element: <AdminItemLists /> },
      { path: 'admin/item/insert', element: <ItemInsertAdminRoutes /> },
      { path: 'admin/item/update/:iid', element: <ItemUpdateAdminRoutes/> },
      { path: 'admin/QnAlist', element: <AdminQnAList/> },
      { path: 'admin/order/list', element: <AdminOrderLists /> },
      { path: 'admin/chart', element: <Dashboard /> },
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

function ProductAnalysisPage() {
  const { user } = useAuthContext(); 
  return user && user.isAdmin ? <ProductAnalysis /> : <MainPage />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();
