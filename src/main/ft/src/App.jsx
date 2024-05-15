import React from "react";
import { Outlet } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthContextProvider>
        <NavigationBar/>
        <Outlet />
        <Footer />
    </AuthContextProvider>
  );
}