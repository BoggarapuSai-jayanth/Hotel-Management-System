import http from 'http';

const data = JSON.stringify({
    name: "TestUser",
    email: "test" + Date.now() + "@example.com",
    password: "password123"
});

const req = http.request(
    { 
        hostname: 'localhost', 
        port: 5000, 
        path: '/api/auth/register', 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Content-Length': data.length 
        } 
    },
    res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
    }
);
req.on('error', e => console.error("HTTP ERROR:", e));
req.write(data);
req.end();
