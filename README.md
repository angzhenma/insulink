# 🩺 Insulink – DDAC G7 Group Assignment

This is a cloud-based diabetes support platform with separate role-based systems for Admin, Coach, and Patient.
Done and developed by Azaan, Auwes and Yanaal.

## 📁 Project Structure

insulink-v1/
├── frontend/ ← All frontend UIs
│ ├── admin/
│ ├── coach/
│ ├── patient/
│ ├── common/
├── backend/ ← All backend APIs
│ ├── admin/
│ ├── coach/
│ ├── patient/
│ ├── middleware/


## 🚀 Getting Started (for Team Members)

### 🧱 Backend Setup

1. Clone the repo:

git clone https://github.com/your-username/insulink-v1.git


2. Navigate to backend:

cd insulink-v1/backend
npm install


3. Copy `.env.example` → `.env` and fill in your AWS credentials

4. Start your role’s backend:

node admin/admin-app.js


---

### 🌐 Frontend Preview (optional)

You can serve the frontend using:

cd insulink-v1/frontend
npx serve .


Then open `index.html` in your browser

---

### 📦 Tech Stack

- Node.js + Express
- AWS DynamoDB + S3
- Vanilla JS Frontend
- JWT Auth
- Role-Based Access

---

## ✅ Notes

- Each role’s frontend & backend is self-contained
- Only `.env.example` is committed for security
- Use Git to manage team contributions