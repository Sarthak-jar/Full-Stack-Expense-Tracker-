# MERN Expense Tracker

A full-stack implementation of an Expense Tracker application using the MERN stack (MongoDB, Express, React, Node.js). This application allows users to track their income and expenses, view a dashboard with financial insights, and manage their authentication securely.

## Features

-   **User Authentication**: Secure Sign Up and Login using JWT (JSON Web Tokens).
-   **Dashboard**: Visual overview of financial status.
-   **Income Management**: Add and view income records.
-   **Expense Management**: Add and view expense records.
-   **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Axios, Recharts, Lucide React.
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose).
-   **Authentication**: JSON Web Tokens (JWT), Bcryptjs.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   **Node.js**: Ensure you have Node.js installed.
-   **MongoDB**: You need a MongoDB connection string (locally or via MongoDB Atlas).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Expense_Tracker
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

### Environment Variables

You need to create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Application

1.  **Start the Backend Server:**
    Navigate to the `server` directory and run:
    ```bash
    npm run dev
    ```
    *This runs the server with `nodemon` for auto-restarts on changes.*

2.  **Start the Client Application:**
    Open a new terminal, navigate to the `client` directory, and run:
    ```bash
    npm run dev
    ```
    *This starts the Vite development server, usually at `http://localhost:5173`.*

## API Endpoints

-   `POST /auth/register` - Register a new user
-   `POST /auth/login` - Login user
-   `POST /income` - Add income
-   `GET /income` - Get income
-   `POST /expense` - Add expense
-   `GET /expense` - Get expenses
