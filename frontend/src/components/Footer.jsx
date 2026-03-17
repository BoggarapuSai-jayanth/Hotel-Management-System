import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-8 text-center mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <p className="mb-2">&copy; {new Date().getFullYear()} LuxeStays Hotels & Resorts. All rights reserved.</p>
                <p className="text-sm text-slate-500">Premium bookings, effortless experiences.</p>
            </div>
        </footer>
    );
};

export default Footer;
