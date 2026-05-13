require('dotenv').config();

const axios = require('axios');

const API_URL =
  process.env.BACKEND_URL || 'http://localhost:5000';

axios.post(
  `${API_URL}/api/auth/google`,
  {
    token: "mock_google_token"
  }
)
.then(res => {
  console.log('Success:', res.data);
})
.catch(err => {
  console.error(
    'Error:',
    err.response ? err.response.data : err.message
  );
});