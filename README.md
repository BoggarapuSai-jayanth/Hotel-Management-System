# Hotel Management System

A full-featured Hotel Management application built with the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to browse hotels, view dynamic details and map locations, seamlessly book rooms with integrated payments, and even interact with an AI-powered customer support chatbot. It also includes a comprehensive Admin Dashboard to manage hotels, view statistics, and monitor bookings.

## Live Demo

Frontend: https://hotel-management-system-dun-one.vercel.app

Backend API: https://hotel-management-system-8xz6.onrender.com

## 🌟 Key Features

* **User Authentication**: Secure Login and Registration system with Email OTP verification and Google OAuth integration.
* **Modern UI**: Fully responsive, aesthetic user interface built with React, Tailwind CSS, and Framer Motion animations.
* **Hotel Exploration**: View different hotels, filter by amenities, and check locations on interactive maps (Google Maps / Leaflet).
* **Booking & Payments**: Frictionless booking process integrated with **Razorpay** for secure transactions.
* **AI Chatbot Support**: Instant customer service using an integrated AI Chatbot powered by Google Gemini.
* **Admin Dashboard**: A secure portal for administrators to add new hotels, track system statistics, and manage user bookings in real-time.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Fast mapping and component-based UI.
- **Tailwind CSS**: Utility-first CSS framework for rapid and modern styling.
- **Framer Motion**: Smooth animations and transitions.
- **Axios**: Promised-based HTTP client for the browser.
- **React Leaflet / Google Maps API**: Interactive maps.
- **Razorpay**: Frontend checkout integration.

### Backend
- **Node.js & Express.js**: Fast, unopinionated routing and API handling.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **JSON Web Tokens (JWT)**: Secure user sessions and authorization.
- **BcryptJS**: Password hashing and protection.
- **Nodemailer**: For sending OTPs and email notifications.
- **Google Generative AI (Gemini)**: Powers the automated support chatbot.
- **Razorpay API**: Secure backend payment verification processing.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
Make sure you have Node.js and npm installed on your machine.
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/your_username/Hotel-Management-System.git
   cd Hotel-Management-System
   ```

2. **Install Backend Dependencies**
   ```sh
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_app_password
   ```

   Create a `.env` file in the `frontend` directory and add the following:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   # Optional: VITE_API_BASE_URL=http://localhost:5001
   ```

5. **Run the Application**

   *Start the Backend Server (Terminal 1)*
   ```sh
   cd backend
   npm run dev
   ```

   *Start the Frontend Server (Terminal 2)*
   ```sh
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
