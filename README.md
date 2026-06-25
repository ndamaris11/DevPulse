# DevPulse 🚀

Welcome to **DevPulse**, a full-stack MERN application featuring a responsive React frontend and a robust Node.js/Express backend integrated with MongoDB.

---

## ✨ Key Features

* **User Authentication:** Secure user signup and login functionality using JSON Web Tokens (JWT) and password hashing (bcryptjs).
* **Project Dashboard:** A clean, responsive dashboard interface where users can view, track, and manage their development projects.
* **Full-Stack Data Flow:** Seamless API routing connecting a React frontend to a Node.js/Express backend server.
* **Database Management:** Scalable data modeling for users and projects integrated directly with MongoDB.

---

## 📁 Project Structure

This repository contains both the frontend and backend of the application:
* **`client/`**: The React frontend (powered by Vite).
* **`server/`**: The Node.js API backend (Express, Mongoose, Authentication).

---

## 🛠️ Tech Stack

* **Frontend:** React, HTML5, CSS3, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Security:** JSON Web Tokens (JWT), bcryptjs

---

## 🚀 Quick Start

> 💡 **Note:** Ensure you create a `.env` file in the `server` directory with your `MONGO_URI` and `JWT_SECRET` variables before starting.

```bash
# Clone the repository
git clone [https://github.com/ndamaris11/DevPulse.git](https://github.com/ndamaris11/DevPulse.git)
cd DevPulse

# Install all dependencies (frontend & backend)
npm run setup

# Start both servers simultaneously
npm run dev
