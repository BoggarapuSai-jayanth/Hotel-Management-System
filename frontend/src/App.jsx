import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from './components/AdminRoute';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Chatbot />
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/hotel/:id" element={<HotelDetails />} />
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
