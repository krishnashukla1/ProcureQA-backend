# ProcureQA - Backend (Node.js + Express)

This is the backend for the **ProcureQA** project, built using **Node.js**, **Express.js**, and **MongoDB**. It manages APIs for user authentication, supplier/product management, and business logic for the ProcureQA platform.

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Nodemailer for email service
- dotenv for environment variables
- Multer (if using file upload)

## 📁 Folder Structure
- `controllers/` – Request handlers
- `routes/` – All route files (auth, supplier, product)
- `models/` – Mongoose schemas
- `middlewares/` – JWT, error handling, etc.
- `config/` – DB connection, constants
- `utils/` – Helper functions (email, validations)
- `server.js` – Entry point

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/krishnashukla1/ProcureQA-backend.git
cd ProcureQA-backend

# 2. Install dependencies
npm install

# 3. Create a .env file and add the following:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# 4. Run the server
npm run dev
