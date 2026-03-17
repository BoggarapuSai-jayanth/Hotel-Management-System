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
    'frontend/src/components/Chatbot.jsx',
    'backend/.env',
    'backend/server.js'
];

const basePath = __dirname; // Assuming script is in root

let modifiedCount = 0;

filesToUpdate.forEach(relativePath => {
    const filePath = path.join(basePath, relativePath);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let newContent = content;
        if (relativePath.includes('frontend')) {
            newContent = content.replace(/http:\/\/localhost:5000/g, 'http://localhost:5001');
        } else if (relativePath === 'backend/.env') {
            newContent = content.replace(/PORT=5000/g, 'PORT=5001');
        } else if (relativePath === 'backend/server.js') {
            newContent = content.replace(/\|\| 5000/g, '|| 5001');
        }

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
