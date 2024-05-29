import React from "react";
import { Outlet } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import RecentItems from "./components/Item/RecentItems";
import Karlo from "./components/AI/Karlo";
import BackgroundRemoval from "./components/AI/BackgroundRemoval";
import ImageDownload from "./components/AI/ImageDownload";
import ScrollToTop from "./components/publics/ScrollToTop";

export default function App() {
  return (
    <AuthContextProvider>
        <NavigationBar/>
        <RecentItems/>
        <ImageDownload/>
        <Karlo/>
        <BackgroundRemoval/>
        <Outlet />
        <ScrollToTop/>
        <Footer />
    </AuthContextProvider>
  );
}