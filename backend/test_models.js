import fetch from 'node-fetch'; // or use native fetch if node >= 18
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function run() {
    const logStream = fs.createWriteStream('models_result.log');
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await res.json();
        logStream.write(JSON.stringify(data, null, 2));
    } catch (error) {
        logStream.write("Error: " + error);
    }
    logStream.end();
}
run();
