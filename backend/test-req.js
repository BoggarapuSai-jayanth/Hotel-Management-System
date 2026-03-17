import http from 'http';

const data = JSON.stringify({
    user: "65bad9f01234567890abcdef",
    hotel: "65bac5d625b5971ea9b02a77",
    roomType: "Deluxe",
    checkIn: "2023-12-01",
    checkOut: "2023-12-05",
    totalAmount: 5000
});

const req = http.request(
    { hostname: 'localhost', port: 5000, path: '/api/bookings', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    res => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
    }
);
req.on('error', e => console.error("HTTP ERROR:", e));
req.write(data);
req.end();
