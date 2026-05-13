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

        // Replace localhost URLs
        newContent = newContent.replace(
            /http:\/\/localhost:5000/g,
            '${import.meta.env.VITE_API_URL}'
        );

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