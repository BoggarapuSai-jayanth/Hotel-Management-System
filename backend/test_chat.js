import axios from 'axios';

async function test() {
    try {
        console.log('Hitting chat API...');
        const res = await axios.post('http://localhost:5000/api/chat', { message: 'test' });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error Response:', err.response?.data || err.message);
    }
}

test();
