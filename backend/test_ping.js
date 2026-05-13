import dotenv from 'dotenv';

dotenv.config();

const API_URL =
    process.env.BACKEND_URL || 'http://localhost:5000';

fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: 'test'
    })
})
.then(res => res.json())
.then(data => {
    console.log('Success:', data);
})
.catch(err => {
    console.error('Error:', err.message);
});