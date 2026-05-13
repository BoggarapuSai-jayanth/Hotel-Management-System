import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL =
    process.env.BACKEND_URL || 'http://localhost:5000';

async function test() {
    try {
        console.log('Hitting chat API...');

        const res = await axios.post(
            `${API_URL}/api/chat`,
            {
                message: 'test'
            }
        );

        console.log('Success:', res.data);

    } catch (err) {
        console.error(
            'Error Response:',
            err.response?.data || err.message
        );
    }
}

test();