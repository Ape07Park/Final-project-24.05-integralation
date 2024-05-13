import React from "react";
import { Outlet } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import ApiTest from "./pages/apitest";



export default function App() {
  return (
    <AuthContextProvider>
        <NavigationBar/>
        {/* <ApiTest/> */}
        <Outlet />
        <Footer />

    </AuthContextProvider>
  );
}