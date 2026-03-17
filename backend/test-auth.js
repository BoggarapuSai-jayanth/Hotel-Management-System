const axios = require('axios');
axios.post('http://localhost:5001/api/auth/google', {token: "mock_google_token"})
  .then(res => console.log("SUCCESS:", res.data))
  .catch(err => {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  });
