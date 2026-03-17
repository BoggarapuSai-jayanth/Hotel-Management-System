import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user exists and is an admin
    if (user && user.role === 'admin') {
        return <Outlet />;
    } else {
        // Redirect non-admins to the dedicated admin login page
        return <Navigate to="/admin-login" replace />;
    }
};

export default AdminRoute;
