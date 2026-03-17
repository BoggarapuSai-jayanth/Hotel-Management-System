import connectDB from './config/db.js';
import { register } from './controllers/authController.js';

// Setup Mock Req/Res
const mockReq = {
    body: {
        name: 'Test Name',
        email: `test${Date.now()}@test.com`,
        password: 'password123'
    }
};

const mockRes = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log(`\n--- RESPONSE (Status: ${this.statusCode}) ---`);
        console.log(JSON.stringify(data, null, 2));
        console.log("--------------------------------\n");
        process.exit(0);
    }
};

async function testRegistration() {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("DB Connected. Running register controller...");
    
    await register(mockReq, mockRes);
}

testRegistration().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
