const axios = require('axios');
axios.post('http://localhost:5000/api/auth/google', {token: "mock_google_token"})
  .then(res => console.log(res.data))
  .catch(err => {
    console.error(err.response ? err.response.data : err.message);
  });
