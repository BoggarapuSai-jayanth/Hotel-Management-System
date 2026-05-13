const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'frontend/src/pages/Profile.jsx',
    'frontend/src/pages/LandingPage.jsx',
    'frontend/src/pages/HotelDetails.jsx',
    'frontend/src/pages/Home.jsx',
    'frontend/src/pages/AdminLogin.jsx',
    'frontend/src/pages/AdminDashboard.jsx',
    'frontend/src/components/Navbar.jsx',
    'frontend/src/components/Chatbot.jsx'
];

const basePath = __dirname;

let modifiedCount = 0;

filesToUpdate.forEach(relativePath => {
    const filePath = path.join(basePath, relativePath);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = content;
        
        // Replace 'http://localhost:5001/...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/...`
        // We have to handle both single quotes and backticks.
        
        // 1. Single quotes: 'http://localhost:5001/api/...' -> `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/...`
        newContent = newContent.replace(/'http:\/\/localhost:5001(\/api\/[^']+)'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5001\'}$1`');
        
        // 2. Backticks: `http://localhost:5001/api/...` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/...`
        newContent = newContent.replace(/`http:\/\/localhost:5001(\/api\/[^`]+)`/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5001\'}$1`');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated ${relativePath}`);
            modifiedCount++;
        } else {
            console.log(`No changes needed in ${relativePath}`);
        }
    } else {
        console.error(`File not found: ${filePath}`);
    }
});

console.log(`Total files modified: ${modifiedCount}`);
