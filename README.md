# GigFlow 🚀

GigFlow is a full-stack freelance marketplace platform where Clients can post gigs and Freelancers can bid on them. The application features secure authentication, fluid user roles, real-time notifications, and atomic database transactions for hiring integrity.



## 🌟 Features

- **Fluid Roles**: A single user account can both Post Gigs (Client) and Bid on Gigs (Freelancer).
- **Secure Authentication**: JWT-based auth with HttpOnly cookies and protection against CSRF.
- **Atomic Hiring Logic**: Uses MongoDB Transactions to ensure that when a freelancer is hired:
  - Gig status updates to `Assigned`.
  - Selected Bid updates to `Hired`.
  - All other bids are automatically `Rejected`.
- **Real-time Notifications**: Socket.io integration to notify freelancers instantly when hired.
- **Search & Filter**: Find gigs by title instantly.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Socket.io Client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB (Mongoose) with Replica Set support (Atlas)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas URI (for Transactions support)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gigflow.git
   cd gigflow
   ```

2. **Install Dependencies**
   ```bash
   # Install Server dependencies
   cd server
   npm install

   # Install Client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

   (Optional) If deploying, `CLIENT_URL` should be your production frontend URL.

4. **Run Locally**

   Start Backend:
   ```bash
   cd server
   npm run dev
   ```

   Start Frontend:
   ```bash
   cd client
   npm run dev
   ```

   Access the app at `http://localhost:5173`.

## 📂 Project Structure

```
GigFlow/
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth Context
│   │   ├── pages/       # App Pages (Dashboard, Home, etc)
│   │   └── ...
├── server/          # Express Backend
│   ├── config/      # DB Connection
│   ├── controllers/ # Route Logic
│   ├── models/      # Mongoose Models (User, Gig, Bid)
│   ├── routes/      # API Routes
│   ├── middleware/  # Auth Middleware
│   └── index.js     # Entry Point
```

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user (Set Cookie) |
| `GET` | `/api/gigs` | Fetch all open gigs |
| `POST` | `/api/gigs` | Create a new gig |
| `POST` | `/api/bids` | Place a bid on a gig |
| `PATCH` | `/api/bids/:id/hire` | Hire a freelancer (Atomic) |

## 📜 License

This project is licensed under the MIT License.
