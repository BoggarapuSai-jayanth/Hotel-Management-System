const data = {
    name: "TestUser",
    email: "test" + Date.now() + "@test.com",
    password: "password123"
};

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
.then(res => res.json().then(body => ({ status: res.status, body })))
.then(res => {
    console.log("STATUS:", res.status);
    console.log("BODY:", JSON.stringify(res.body, null, 2));
})
.catch(err => {
    console.error("FETCH ERROR:", err);
});
