# 📊 Expense Tracker App (MERN Stack)

A **full-stack Expense Tracker web application** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.  
The application allows users to securely manage income and expenses, visualize financial data using interactive charts, and export reports in Excel format.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Secure Sign-Up and Login using **JWT authentication**
  - Protected routes with token-based authorization

- 📊 **Dashboard Overview**
  - Displays **Total Balance, Income, and Expenses**
  - Real-time summary cards

- 💰 **Income Management**
  - Add, view, and delete income sources
  - Export income data to **Excel**

- 💸 **Expense Management**
  - Add, view, and delete expenses
  - Category-based tracking
  - Export expense data to **Excel**

- 📈 **Interactive Charts**
  - Pie, Bar, and Line charts for financial insights
  - Last 30 days expenses & last 60 days income analysis

- 🕒 **Recent Transactions**
  - Displays the most recent income and expense records

- 📱 **Responsive UI**
  - Fully responsive design for desktop, tablet, and mobile devices

- 🧭 **Intuitive Navigation**
  - Sidebar navigation for Dashboard, Income, Expenses, and Logout

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Context API
- Chart libraries (Bar, Pie, Line)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- RESTful APIs

### Tools & Utilities
- Excel file export for reports
- Profile image upload
- API-based data handling

---

## 🧩 Project Structure

```text
expense-tracker/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── api/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
